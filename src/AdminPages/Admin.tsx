import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserAnalysis from "./UserAnalysis";
import MyBarChart from "../Comp/myLineChart";


// import { RootState } from "../../config/Store/store";
interface ApiResponse {
  message?: string;
  documents?: Category[];

}
interface ServiceDocument {
  _id: string;
  noOfProviders: number;
  serviceName: string;
  color?: string;
  [key: string]: any;

}

interface IApiResponse {
  documents?: ServiceDocument[];
  totalUsers: number;
  groupBy: string;
  [key: string]: any;

}
interface RootState {
  allServices: { ALLSERVICES: Category[] };
  [key: string]: any;

}
interface ApiResponse {
  message?: string;
  documents?: Category[];

}
interface Category {
  _id: string;
  documents: Service[];
  [key: string]: any;

}

interface DashboardApiResponse {

}
interface Service {
  _id: string;
  servicename?: string;
  documents?: Service[];
  [key: string]: any;
}


const AdminDashboard: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [groupBy, setGroupBy] = useState<string>("month");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [serviceData, setServiceData] = useState<ServiceDocument[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [graphType, setGraphtype] = useState<string>("services");
  const [roledata, setRoleData] = useState([])
  const handleGraphTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphtype(event.target.value);
  };
  const handleGroupByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setGroupBy(event.target.value);
    }
  };
  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStateFilter(event.target.value);
  };



  return (
    <div>
      <div className=" ml-auto">
        {/* <AdminHeader /> */}

        <div >

          <div className="pb-6 pl-6 pr-10">
            <UserAnalysis />
            <div className="grid gap-3 justify-between pb-5 shadow-lg bg-white rounded-xl mb-2 py-3 px-6  grid-cols-2">
              <div>
                <h2 className="font-Poppins-SemiBold text-[#232323] font-size-20px mb-2">Users</h2>
                <MyBarChart />
              </div>
              <div className="total-provider-graph ">
                <h2 className="font-Poppins-SemiBold text-[#232323] font-size-20px mb-2">Users categories</h2>
                {/* <ProvidersChart /> */}
              </div>
            </div>



            {/* <div className="service-provided-graph-box bg-white">
              <div className="services-provided">
                <div className="services-provided-header">
                  <select
                    onChange={(e) => handleGraphTypeChange(e)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      width: "100%",
                      backgroundColor: "#E3F2F1",
                      border: "1px solid #B5B5B5",
                      outline: "none",
                    }}
                    className="font-Poppins-Medium text-[#003E3A] font-size-13px"
                  >
                    <option className="font-Poppins-Medium text-[#003E3A] font-size-13px" value="services">Provided services</option>
                    <option className="font-Poppins-Medium text-[#003E3A] font-size-13px" value="search">Looking for services</option>
                    <option className="font-Poppins-Medium text-[#003E3A] font-size-13px" value="jobs">Job listing services</option>
                  </select>
                </div>
                <div className="services-provided-dropdown-content">
                  <label className="flex gap-2 font-Poppins-Medium text-[#000000] font-size-13px items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}  // Updated to match the renamed function
                    // onChange={toggleSelectAll}  // Updated to match the renamed function
                    />
                    Select all
                  </label>
                  <div className="services-provided-list">
                    {ALLSERVICES && ALLSERVICES.map((category) => (
                      <div key={category._id} className="category-group">
                        {category.documents.map((service) => (
                          <div
                            key={service?._id}
                            className={`service-item font-Poppins-Medium font-size-13px ${selectedServices.includes(service._id) ? 'active' : ''}`}
                            onClick={() => handleServiceClick(service._id)}
                          >
                            {service?.servicename}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="total-provider-graph-last">
                <div className="hidelabelGraph" style={styles.textContainer}>
                  {/* <div className="relative">
                    </div> */}
                  {/* <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                    <span className="graph-circle-jugar"></span>
                    {pieChartData && pieChartData.length > 0 ? (
                      <MuiPieChart
                        key={JSON.stringify(pieChartData)}  // Force re-render on data change

                        series={[
                          {
                            arcLabelMinAngle: 45,
                            data: pieChartData,

                          },
                        ]}
                        sx={{
                          [`& .${pieArcLabelClasses.root}`]: {
                            fill: '#FFFFFF',
                            fontWeight: 'bold',
                            fontSize: '16px',
                          },
                        }}
                      />
                    ) : (
                      <div>No data available</div>
                    )}
                  </div>
                  <div className="pie-cart-contaent">
                    <select id="filter" className="select-option-amdin font-Poppins-Medium font-size-13px mb-3" value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
                      <option className="font-Poppins-Medium font-size-13px" value="">All states</option>
                      <option className="font-Poppins-Medium font-size-13px" value="QLD">Queensland</option>
                      <option className="font-Poppins-Medium font-size-13px" value="TAS">Tasmania</option>
                      <option className="font-Poppins-Medium font-size-13px" value="NSW">New South Wales</option>
                      <option className="font-Poppins-Medium font-size-13px" value="VIC">Victoria</option>
                      <option className="font-Poppins-Medium font-size-13px" value="WA">Western Australia</option>
                      <option className="font-Poppins-Medium font-size-13px" value="SA">South Australia</option>
                      <option className="font-Poppins-Medium font-size-13px" value="NT">Northern Territory</option>
                      <option className="font-Poppins-Medium font-size-13px" value="ACT">Australian Capital Territory</option>
                    </select>
                    <div className="flex gap-4 mb-4">
                      <label className="flex gap-2 text-[#000000] items-center font-Poppins-Medium font-size-13px">
                        <input
                          type="checkbox"
                          checked={groupBy === "week"}
                          value="week"
                          onChange={handleGroupByChange}
                        />
                        Weekly
                      </label>
                      <label className="flex gap-2 text-[#000000]  items-center font-Poppins-Medium font-size-13px">
                        <input type="checkbox" defaultChecked
                          checked={groupBy === "month"}
                          value="month"
                          onChange={handleGroupByChange}
                        />


                        Monthly
                      </label>
                      <label className="flex gap-2 text-[#000000]  items-center font-Poppins-Medium font-size-13px">
                        <input
                          type="checkbox"
                          checked={groupBy === "year"}
                          value="year"
                          onChange={handleGroupByChange}

                        /> Yearly
                      </label>
                    </div>
                    {pieChartData && pieChartData.length > 0 &&
                      <div className="Daily-Living-and-Access">

                        {pieChartData.map((service, index) => (
                          <div key={`legend-${index}`} className="flex gap-2 text-[#000000] font-Poppins-Medium font-size-13px items-center">
                            <div
                              className="legend-color"
                              style={{ backgroundColor: (service?.color) }}
                            ></div>
                            <span className="txt-turncate1">
                              {service?.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    }

                  </div>
                </div>
              </div>
            </div> */} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const styles: { [key: string]: React.CSSProperties } = {
  textContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    backgroundColor: '#e8f8f5',
  },
  totalProviders: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  legend: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
  legendColor: {
    width: '15px',
    height: '20px',
    marginRight: '5px',
    borderRadius: '50%',
  },
};
