import React, { useState, useEffect } from 'react';

interface IApiResponse {
    documents: {
        _id: string;
        roleCount: number;
        [key: string]: any;
    }[];
    totalUsers: number;
    [key: string]: any;
}

function ProvidersChart() {
    const [data, setData] = useState<{ label: string; value: number; color: string }[]>([]);
    const [totalUser, setTotalUser] = useState<number>(0);
    const [query, setQuery] = useState<string>("week");
    const [state, setState] = useState<string>("");
    const [role, setRole] = useState<string>("participant"); // Default to 'participant'

    const handleCheckboxChange = (value: string) => {
        setQuery(value);
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setState(event.target.value);
    };

    const fetchProviderGraph = async () => {
        const { res, err } = await httpRequest<IApiResponse>({
            method: "get",
            path: `/api/admin/user/provider-graph?groupBy=&state=${state}&role=${role}`
        });

        if (res) {
            console.log(res , "dfsdfasdfasdfasdfasd----------------sdfasdf-asdfafasdf-");
            // Define a list of colors
            const defaultColors = [
                '#FEBE64', '#FFAF92', '#81FFD7', '#FF4560', '#775DD0',
                '#00D9E9', '#FF66C3', '#3F51B5', '#546E7A', '#D4526E',
                '#13D8AA', '#A5978B', '#4ECDC4', '#C7F464', '#81D4FA',
                '#F9A3A4', '#F48024', '#69D2E7', '#E91E63', '#FF9800'
            ];

            // Map the API response to the chart data format
            const transformedData = res.documents.map((doc, index) => ({
                label: doc._id,
                value: doc.roleCount,
                color: defaultColors[index % defaultColors.length] // Assign color based on index
            }));

            setData(transformedData);
            setTotalUser(res.totalUsers ?? 0); // Default to 0 if undefined
        } else {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProviderGraph();
    }, [query, state, role]); // Re-fetch data when 'query', 'state', or 'role' changes

    console.log(data, "=============>")
    const series = data.map(item => item.value);

    const labels = data.map(item => item.label);
    const colors = data.map(item => item.color);

    const chartOption: any = {
        chart: {
            type: 'donut',
        },
        legend: {
            show: false, // Disable the legend
        },
        labels: labels, // Labels from data
        colors: colors,

    };

    return (
        <div className='user-graph-inner p-2'>
            <div className="flex gap-3 justify-between items-center px-4">
                <p className="font-Poppins-SemiBold text-[#232323] font-size-20px mb-2 capitalize">
                    {role}s: <strong>{totalUser}</strong>
                </p>
                <label>

                    <select onChange={handleStateChange} value={state} className="select-option-amdin font-Poppins-Medium font-size-13px">
                        <option value="">All states</option>
                        <option value="QLD">Queensland</option>
                        <option value="TAS">Tasmania</option>
                        <option value="NSW">New South Wales</option>
                        <option value="VIC">Victoria</option>
                        <option value="WA">Western Australia</option>
                        <option value="SA">South Australia</option>
                        <option value="NT">Northern Territory</option>
                        <option value="ACT">Australian Capital Territory</option>
                    </select>
                </label>
                <div className="">
                    <div className="role-switch-container">
                        <input
                            type="radio"
                            id="switchParticipantNew"
                            name="switchRoleNew"
                            value="participant"
                            checked={role === "participant"}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <input
                            type="radio"
                            id="switchProviderNew"
                            name="switchRoleNew"
                            value="provider"
                            checked={role === "provider"}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        <label htmlFor="switchParticipantNew" className="role-label role-label-participant">
                            Participant
                        </label>
                        <label htmlFor="switchProviderNew" className="role-label role-label-provider">
                            Provider
                        </label>
                        <div className="role-switch-wrapper">
                            <div className="role-switch">
                                <div className="role-option">Participant</div>
                                <div className="role-option">Provider</div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div className='h-full'>
                <div className='grid justify-between mt-4 items-center' style={{ gridTemplateColumns: "28% 68%" }}>
                    <div className='pl-2'>

                        <ul style={{ listStyle: "none", padding: 0 }}>
                            {data.map((item, index) => (
                                <li key={index} style={{ color: item.color, display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ backgroundColor: item.color, width: '12px', height: '12px', borderRadius: '50%', marginRight: '8px' }}></span>
                                    <span className='font-size-16px font-Poppins-Regular capitalize-first-letter'> {item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div
                        //  className="chart-container-donut"
                        className='apex-chart-admin'
                    >
                        <ReactApexChart
                            options={chartOption}
                            series={series}
                            type="donut"
                            width="300"
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProvidersChart;
