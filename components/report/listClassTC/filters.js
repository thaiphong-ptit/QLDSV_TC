import React, { useEffect, useState } from "react";
import Select from "react-select";
import { adminApi } from "../../services/adminService";
import { toast } from "react-toastify";

export default function Filters(props) {
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  const [currentCN, setCurrentCN] = useState(
    JSON.parse(localStorage.getItem("currentCN"))
  );
  const dsKhoas = JSON.parse(localStorage.getItem("dsPhanManh")).slice(0, 2);

  const { filters, setFilters, filtersRef } = props;

  const filtersData = filters;

  const dbConfig = JSON.parse(localStorage.getItem("currentDB"));
  // In danh sách lớp tín chỉ
  const inDsLopTC = async (data) => {
    const payload = {
      chiNhanh: currentCN.value,
      password: dbConfig.password,
      user: dbConfig.user,
      NIENKHOA: data.nienKhoa,
      HOCKY: data.hocKy,
      USER: userLogin.HOTEN,
    };
    try {
      const res = await adminApi.inDsLopTC(payload);
      if (res) {
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [dsFilter, setdsFilter] = useState();
  // lấy ds Filter
  const layDsFilter = async () => {
    const payload = {
      chiNhanh: currentCN.value,
      password: dbConfig.password,
      user: dbConfig.user,
    };
    try {
      const res = await adminApi.layDsFilter(payload);
      if (res.data) {
        const data = {
          nienKhoa: res.data?.nienKhoa?.map((x) => ({
            label: x.NIENKHOA.trim(),
            value: x.NIENKHOA.trim(),
          })),
          hocKy: res.data?.hocKy?.map((x) => ({
            label: x.HOCKY,
            value: x.HOCKY,
          })),
          nhom: res.data?.nhom?.map((x) => ({
            label: x.NHOM,
            value: x.NHOM,
          })),
        };

        setdsFilter(data);
      }
    } catch (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    layDsFilter();
  }, [currentCN]);

  return (
    <div style={{ backgroundColor: "#c2bdbd", paddingBottom: "0.2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h3>DANH SÁCH LỚP TÍN CHỈ</h3>
      </div>

      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              paddingLeft: "33rem",
            }}
          >
            <label style={{ paddingRight: "4rem", fontWeight: "bold" }}>
              Khoa
            </label>
            <div style={{ width: "18rem" }}>
              <Select
                isDisabled={userLogin.ROLENAME !== "PGV" ? true : false}
                defaultValue={currentCN}
                options={dsKhoas}
                onChange={(value) => {
                  localStorage.setItem("currentCN", JSON.stringify(value));
                  setCurrentCN(value);
                }}
              ></Select>
            </div>
          </div>

          <div
            key={currentCN?.value}
            style={{ position: "relative", paddingLeft: "33rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginBlock: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                <label style={{ marginRight: "2rem" }}>Niên khóa</label>
                <div style={{ width: "18rem" }}>
                  <Select
                    onChange={(e) => {
                      filtersRef.current.nienKhoa = e.value;
                      filtersData.nienKhoa = e.value;
                    }}
                    placeholder="Niên khóa"
                    options={dsFilter?.nienKhoa}
                  ></Select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "start" }}>
              <div style={{ display: "flex", justifyContent: "start" }}>
                <label style={{ marginRight: "3.75rem" }}>Học kỳ</label>
                <div style={{ width: "18rem" }}>
                  <Select
                    onChange={(e) => {
                      filtersRef.current.hocKy = e.value;
                      filtersData.hocKy = e.value;
                    }}
                    placeholder="Học kỳ"
                    options={dsFilter?.hocKy}
                  ></Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button
          onClick={() => {
            setFilters(filtersData);
            inDsLopTC(filtersData);
          }}
          className="buttonLogic"
          style={{ float: "none", marginRight: "2rem" }}
        >
          In danh sách
        </button>
      </div>
    </div>
  );
}
