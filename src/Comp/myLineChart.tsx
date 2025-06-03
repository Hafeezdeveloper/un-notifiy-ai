import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material'; // For the loading spinner
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { GetApi } from '../Helper/ApiHandle/BsApiHandle';
import { toast } from 'sonner';

interface IDataItem {
    name: string;
    student: number;
    teacher: number;
    faculty: number;
}

interface IData {
    _id: number;
    participantCount: number;
    providerCount: number;
    companyCount: number;
}

interface IApiResponse {
    documents: IData[];
    totalUsers: number;
    [key: string]: any;
}

const MyBarChart: React.FC = () => {
    const [isLoader, setIsLoader] = useState<boolean>(false);
    const [data, setData] = useState<IDataItem[]>([]);
    const [category, setCategory] = useState<string>('monthly'); // 'monthly' or 'yearly'
    const [totalUser, setTotalUser] = useState<number>(0);
    const [stateFilter, setStateFilter] = useState<string>('');

    const fetchUserStats = async () => {
        setIsLoader(true);
        const groupBy = category === 'monthly' ? 'month' : 'year';
        const res = await GetApi<any>(`/user/users-graph?state=${stateFilter}&groupBy=${groupBy}`);

        if (res) {
            const { documents, totalUsers } = res.data;
            
            
            setTotalUser(totalUsers);

            let labels: string[] = [];
            let dataMap: { [key: string]: IDataItem } = {};

            if (category === 'monthly') {
                // Labels are months from 'Jan' to 'Dec'
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            } else if (category === 'yearly') {
                // Labels are the last 5 years including the current year
                const currentYear = new Date().getFullYear();
                const yearsToShow = 5; // Adjust as needed (3 to 5 years)
                labels = [];
                for (let i = yearsToShow - 1; i >= 0; i--) {
                    labels.push((currentYear - i).toString());
                }
            }

            // Map the API data to the labels
            documents.forEach((doc:any) => {
                let label = '';
                const id = doc._id;
                if (category === 'monthly') {
                    // Assuming _id is month number from 1 (Jan) to 12 (Dec)
                    label = labels[id - 1]; // labels[0] is 'Jan', so id -1
                } else if (category === 'yearly') {
                    // Assuming _id is the year number (e.g., 2021, 2022)
                    label = id.toString();
                }

                dataMap[label] = {
                    name: label,
                    student: doc.student,
                    teacher: doc.teacher,
                    faculty: doc.faculty,
                };
            });

            // Prepare the data array for the chart
            const chartData = labels.map((label) => {
                return dataMap[label] || {
                    name: label,
                    student: 0,
                    teacher: 0,
                    faculty: 0,
                };
            });

            setData(chartData);
        } else {
            toast.error("err");
        }
        setIsLoader(false);
    };

    useEffect(() => {
        fetchUserStats();
    }, [category, stateFilter]);
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };
    return (
        <div style={{ height: '100%' }}>

            <div className="user-graph-inner">
                <div className="flex justify-between items-center px-4">

                    <div className="flex gap-2">
                        <span className="flex items-center gap-1">
                            <div className="bg-[#00A297] w-[12px] h-[12px] rounded-full"></div>
                            <span className="font-Poppins-Medium font-size-16px">student</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="bg-[#00443F] w-[12px] h-[12px] rounded-full"></div>
                            <span className="font-Poppins-Medium font-size-16px">teacher</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="bg-[#1085AA] w-[12px] h-[12px] rounded-full"></div>
                            <span className="font-Poppins-Medium font-size-16px">faculty</span>
                        </span>
                    </div>
                    <div className="flex gap-4 my-2">
                       
                        <select
                            id="category-select"
                            value={category}
                            onChange={handleSelectChange}
                            className="select-option-amdin font-Poppins-Medium font-size-13px" // Add margin if needed
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        <select
                        id="filter"
                        className="select-option-amdin font-Poppins-Medium font-size-13px"
                        onChange={(e) => setStateFilter(e.target.value)}
                    >
                        <option className="font-Poppins-Medium font-size-13px" value="">
                            All states
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="QLD">
                            Queensland
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="TAS">
                            Tasmania
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="NSW">
                            New South Wales
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="VIC">
                            Victoria
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="WA">
                            Western Australia
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="SA">
                            South Australia
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="NT">
                            Northern Territory
                        </option>
                        <option className="font-Poppins-Medium font-size-13px" value="ACT">
                            Australian Capital Territory
                        </option>
                    </select>

                    </div>
             
                </div>
                {isLoader ? (
                    <div className="text-center">
                        <CircularProgress size={20} style={{ color: '#004540' }} />
                    </div>
                ) : (
                    <ResponsiveContainer className="user-graph-container" height={350}>
                        <BarChart
                            data={data}
                            margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                            barCategoryGap="15%"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="student" fill="#00A297" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="teacher" fill="#00443F" radius={[10, 10, 0, 0]} />
                            <Bar dataKey="faculty" fill="#1085AA" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default MyBarChart;
