import FormContainer from '@/components/FormContainer';
import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserRole } from '@/utils/utils';
import { Class, Prisma, Student } from '@prisma/client';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// student list type
type StudentList = Student & {
  class: Class;
};

const renderRow = async (item: StudentList) => {
  // user role
  const role = await getUserRole();

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {/* image */}
        <Image
          src={item.img || '/noAvatar.png'}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          {/* name */}
          <h3 className="font-semibold">{item.name}</h3>
          {/* class */}
          <p className="text-xs text-gray-500">{item.class?.name}</p>
        </div>
      </td>
      {/* student id */}
      <td className="hidden md:table-cell">{item.username}</td>
      {/* grade */}
      <td className="hidden md:table-cell">{item.class?.name[0]}</td>
      {/* phone */}
      <td className="hidden md:table-cell">{item.phone}</td>
      {/* address */}
      <td className="hidden md:table-cell">{item.address}</td>
      {/* actions */}
      <td>
        <div className="flex items-center gap-2">
          {/* view */}
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-customSky">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
          {/* delete */}
          {role === 'admin' && <FormContainer table="student" type="delete" id={item.id} />}
        </div>
      </td>
    </tr>
  );
};

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const role = await getUserRole();

  const columns = [
    {
      header: 'Info',
      accessor: 'info',
    },
    {
      header: 'Student ID',
      accessor: 'studentId',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Grade',
      accessor: 'grade',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Phone',
      accessor: 'phone',
      className: 'hidden lg:table-cell',
    },
    {
      header: 'Address',
      accessor: 'address',
      className: 'hidden lg:table-cell',
    },
    ...(role === 'admin'
      ? [
          {
            header: 'Actions',
            accessor: 'action',
          },
        ]
      : []),
  ];
  // getting page from url
  const pageParams = searchParams?.page;

  // getting query params
  const queryParams = { ...searchParams };

  // removing page from query params
  delete queryParams?.page;

  // getting page
  const page = parseInt(pageParams || '1');

  // getting query
  const query: Prisma.StudentWhereInput = {};

  // setting query params
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'teacherId':
            query.class = {
              lessons: {
                some: { teacherId: value },
              },
            };
            break;

          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  // redirecting if page is 0 or invalid
  if (page <= 0 || isNaN(page)) {
    const newSearchParams = new URLSearchParams(searchParams || {});
    newSearchParams.set('page', '1');
    redirect(`/list/students?${newSearchParams.toString()}`);
  }

  const [data, count] = await prisma.$transaction([
    // get teachers
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    // get count
    prisma.student.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <SlidersHorizontal className="h-6 w-6" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-customYellow">
              <ArrowUpWideNarrow className="h-6 w-6" />
            </button> */}
            {role === 'admin' && <FormContainer table="student" type="create" />}
          </div>
        </div>
      </div>
      {/* list */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* pagination */}
      <Pagination count={count} page={page} />
    </div>
  );
};

export default StudentListPage;
