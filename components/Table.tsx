'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addUser, addUsers, deleteUser } from '@/store/slices/usersSlice';
import { v4 as uuidv4 } from 'uuid';

export default function Table() {
  // ----- Local state for single user inputs -----
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');

  // ----- Local state for pagination -----
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Show 5 items per page

  // ----- Local state for sorting -----
  const [sortOption, setSortOption] = useState<'ageAsc' | 'ageDesc' | 'nameLenAsc' | 'nameLenDesc'>('ageAsc');

  // ----- Local state for searching by name -----
  const [searchTerm, setSearchTerm] = useState('');

  // Redux
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);

  // ---- 1) Single user "Add" handler ----
  const handleAddUser = () => {
    if (!name || !age || !email) return;

    dispatch(
      addUser({
        id: uuidv4(),
        name,
        age: Number(age),
        email,
      })
    );

    // Clear inputs
    setName('');
    setAge('');
    setEmail('');
  };

  // ---- 2) JSON file upload handler ----
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Expecting an array of objects: [{ name, age, email }, ...]
      const dataFromFile = JSON.parse(text);

      if (Array.isArray(dataFromFile)) {
        const newUsers = dataFromFile.map((item) => ({
          id: uuidv4(),
          name: item.name,
          age: Number(item.age),
          email: item.email,
        }));
        dispatch(addUsers(newUsers));
      } else {
        alert('JSON file must be an array of objects, e.g. [{ "name": "...", "age": ..., "email": "..." }]');
      }
    } catch (err) {
      console.error('Error reading JSON file:', err);
      alert('Failed to read or parse the JSON file.');
    }
  };

  // ---- 3) Delete handler ----
  const handleDeleteUser = (id: string) => {
    dispatch(deleteUser(id));
  };

  // ---- 4) Filtering, Sorting & Pagination ----

  // 4a) Filter: search by name
  // We'll do this in a useMemo so we don't recalculate on every render
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(lowerSearch));
  }, [users, searchTerm]);

  // 4b) Sort the filtered array based on `sortOption`
  const sortedUsers = useMemo(() => {
    // Make a copy so we don’t mutate the original
    const copy = [...filteredUsers];

    switch (sortOption) {
      case 'ageAsc':
        copy.sort((a, b) => a.age - b.age);
        break;
      case 'ageDesc':
        copy.sort((a, b) => b.age - a.age);
        break;
      case 'nameLenAsc':
        copy.sort((a, b) => a.name.length - b.name.length);
        break;
      case 'nameLenDesc':
        copy.sort((a, b) => b.name.length - a.name.length);
        break;
    }

    return copy;
  }, [filteredUsers, sortOption]);

  // 4c) Pagination
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const pageStart = (currentPage - 1) * pageSize;
  const pageEnd = pageStart + pageSize;
  const currentItems = sortedUsers.slice(pageStart, pageEnd);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOption]);

  return (
    <main dir='rtl' className="max-w-4xl transition-all mx-auto p-4 rounded text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-white dark:text-gray-900">طراحی جدول داینامیک با Next js و tailwind</h1>

  
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="نام"
          className="border p-2 rounded w-full md:w-1/4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="سن"
          className="border p-2 rounded w-full md:w-1/4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          value={age}
          onChange={(e) => setAge(e.target.valueAsNumber || '')}
        />
        <input
          type="email"
          placeholder="ایمیل"
          className="border p-2 rounded w-full md:w-1/4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        
        <button
          onClick={handleAddUser}
          className="bg-blue-500  px-4 py-2 rounded  transition-colors 0 text-white dark:text-black"
        >
          اضافه کردن +
        </button>
      </div>

      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <label className="text-white dark:text-gray-900 font-semibold">
          بارگذاری فایل json (ارایه ای با {` name, age, email `})
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="border p-2 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
        />
      </div>

      
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-white dark:text-gray-900 ">جستجو توسط نام:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="مثال: علی"
          className="border p-2 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-white dark:text-gray-900">مرتب سازی:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
          className="border p-2 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option className='text-gray-900 dark:text-white' value="ageAsc">سن (نزولی به صعودی)</option>
          <option className='text-gray-900 dark:text-white' value="ageDesc">سن (صعودی به نزولی)</option>
          <option className='text-gray-900 dark:text-white' value="nameLenAsc">تعداد حروف  (نزولی به صعودی)</option>
          <option className='text-gray-900 dark:text-white' value="nameLenDesc">تعداد حروف  (صعودی به نزولی)</option>
        </select>
      </div>

    
      <table className="min-w-full border-collapse border rounded-3xl border-gray-300">
        <thead>
          <tr className="bg-white dark:bg-gray-900 text-black dark:text-white">
            <th className="border p-2 text-left">نام</th>
            <th className="border p-2 text-left">سن</th>
            <th className="border p-2 text-left">ایمیل</th>
            <th className="border p-2 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(({ id, name, age, email }) => (
            <tr key={id} className="bg-white dark:bg-gray-900 text-black dark:text-white">
              <td className="border p-2">{name}</td>
              <td className="border p-2">{age}</td>
              <td className="border p-2">{email}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDeleteUser(id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}

          {currentItems.length === 0 && (
            <tr>
              <td colSpan={4} className="border p-4 text-center text-white dark:text-gray-900">
                داده ای فعلا ذخیره نشده است ...
              </td>
            </tr>
          )}
        </tbody>
      </table>

      
      <div className="flex justify-between items-center mt-4">
        <div className='text-white dark:text-gray-900'>
          صفحه {currentPage} از {totalPages === 0 ? 1 : totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="text-gray-900 dark:text-white px-3 py-1 rounded disabled:opacity-50 bg-white dark:bg-gray-900"
          >
            قبلی
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="text-gray-900 dark:text-white px-3 py-1 rounded disabled:opacity-50 bg-white dark:bg-gray-900"
          >
            بعدی
          </button>
        </div>
      </div>
    </main>
  );
}