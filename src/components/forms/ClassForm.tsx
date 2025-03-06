'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import {
  classSchema,
  ClassSchema,
  subjectSchema,
  SubjectSchema,
} from '@/lib/formValidationSchemas';
import { createClass, createSubject, updateClass, updateSubject } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // form state
  const [state, formAction] = useFormState(type === 'create' ? createClass : updateClass, {
    success: false,
    error: false,
  });

  // on submit
  const onSubmit = handleSubmit(data => {
    formAction(data);
  });

  // router
  const router = useRouter();

  // after form submission
  useEffect(() => {
    if (state.success) {
      toast.success(`Subject has been ${type === 'create' ? 'created' : 'updated'}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // teachers and grades
  const { teachers, grades } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      {/* title */}
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new class' : 'Update the class'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* class name */}
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        {/* capacity */}
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />
        {/* id */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        {/* supervisor */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('supervisorId')}
            defaultValue={data?.teachers}
          >
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option
                value={teacher.id}
                key={teacher.id}
                selected={data && teacher.id === data.supervisorId}
              >
                {teacher.name + ' ' + teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">{errors.supervisorId.message.toString()}</p>
          )}
        </div>
        {/* grade */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gradeId')}
            defaultValue={data?.gradeId}
          >
            {grades.map((grade: { id: number; level: number }) => (
              <option value={grade.id} key={grade.id} selected={data && grade.id === data.gradeId}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">{errors.gradeId.message.toString()}</p>
          )}
        </div>
      </div>
      {/* error */}
      {state.error && <span className="text-red-500">Something went wrong!</span>}
      {/* button */}
      <button className="bg-customPurple text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  );
};

export default ClassForm;
