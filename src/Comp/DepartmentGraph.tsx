import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';

interface DepartmentData {
  name: string;
  students: number;
  teachers: number;
  faculty: number;
  total: number;
}

const DepartmentGraph = () => {
  const [data, setData] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetApi<any>('/user/department-graph'); // Replace with your API
        setData(response.data.document.map((dept: any) => ({
          name: dept.name,
          students: dept.studentCount,
          teachers: dept.teachersCount,
          faculty: dept.facultyCount,
          total: dept.totalCount
        })));
      } catch (error) {
        toast.error('Failed to load department data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[400px]">
      <h2 className="text-lg font-semibold mb-4">Department wise  Distribution</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} users`, '']}
              labelFormatter={(label) => `Department: ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar dataKey="students" name="Students" fill={colors[0]} />
            <Bar dataKey="teachers" name="Teachers" fill={colors[1]} />
            <Bar dataKey="faculty" name="Faculty" fill={colors[2]} />
            <Bar dataKey="total" name="Total Users" fill={colors[3]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default DepartmentGraph;