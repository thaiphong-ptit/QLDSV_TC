import React, { useEffect, useState } from "react";
import Select from "react-select";
import { adminApi } from "../../services/adminService";
import { toast } from "react-toastify";

export default function Filters(props) {
  const [currentCN, setCurrentCN] = useState(
    JSON.parse(localStorage.getItem("currentCN"))
  );
  const dsKhoas = JSON.parse(localStorage.getItem("dsPhanManh")).slice(0, 2);

  const {
    filters,
    setFilters,
    filtersRef,
    setRefresh,
    modelChange,
    setModelChange,
  } = props;

  const filtersData = filters;

  const dbConfig = JSON.parse(localStorage.getItem("currentDB"));
  const userLogin = JSON.parse(localStorage.getItem("userLogin"));

  // In bảng điểm môn học
  const inDiemLopTC = async (data) => {
    const payload = {
      chiNhanh: currentCN.value,
      password: dbConfig.password,
      user: dbConfig.user,
      NIENKHOA: data.nienKhoa,
      HOCKY: data.hocKy,
      NHOM: data.nhom,
      MONHOC: data.monHoc,
      TENMH: data.tenMH,
      USER: userLogin.HOTEN,
    };
    try {
      const res = await adminApi.inDiemLopTC(payload);
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
  const [dsKhoa, setdsKhoa] = useState();
  // lấy ds Khoa
  const layDsKhoa = async () => {
    const payload = {
      chiNhanh: currentCN.value,
      password: dbConfig.password,
      user: dbConfig.user,
    };
    try {
      const res = await adminApi.layDsKhoa(payload);
      if (res.data) {
        const dsKhoaOptions = Array.from(new Set(res.data))?.map((x) => ({
          label: x.TENKHOA.trim(),
          value: x.MAKHOA.trim(),
        }));
        setdsKhoa(dsKhoaOptions);
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

  // lấy ds môn học
  const [dsMonHoc, setDsMonHoc] = useState();
  const layDsMonHoc = async () => {
    const payload = {
      chiNhanh: currentCN.value,
      password: dbConfig.password,
      user: dbConfig.user,
      pageSize: 100,
      pageNumber: 1,
    };
    try {
      const res = await adminApi.layDsMonHoc(payload);
      if (res.data) {
        let data = res.data?.map((x) => ({
          label: x.TENMH,
          value: x.MAMH,
        }));
        setDsMonHoc(data);
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
    layDsKhoa();
    layDsMonHoc();
    layDsFilter();
  }, [currentCN]);

  return (
    <div style={{ backgroundColor: "#c2bdbd", paddingBottom: "0.2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h3>BẢNG ĐIỂM MÔN HỌC</h3>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <label style={{ paddingRight: "2rem", fontWeight: "bold" }}>
              Khoa
            </label>
            <div style={{ width: "18rem" }}>
              <Select
                defaultValue={currentCN}
                options={dsKhoas}
                isDisabled={userLogin.ROLENAME !== "PGV" ? true : false}
                onChange={(value) => {
                  localStorage.setItem("currentCN", JSON.stringify(value));
                  setCurrentCN(value);
                }}
              ></Select>
            </div>
          </div>
        </div>

        <div
          key={currentCN?.value}
          style={{ position: "relative", paddingLeft: "27rem" }}
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
              <div style={{ width: "10rem" }}>
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

            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginLeft: "3rem",
              }}
            >
              <label style={{ marginRight: "2rem" }}>Nhóm</label>
              <div style={{ width: "10rem" }}>
                <Select
                  onChange={(e) => {
                    filtersRef.current.nhom = e.value;
                    filtersData.nhom = e.value;
                  }}
                  placeholder="Nhóm"
                  options={dsFilter?.nhom}
                ></Select>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "start" }}>
            <div style={{ display: "flex", justifyContent: "start" }}>
              <label style={{ marginRight: "3.75rem" }}>Học kỳ</label>
              <div style={{ width: "10rem" }}>
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

            <div
              style={{
                display: "flex",
                justifyContent: "start",
                marginLeft: "3rem",
              }}
            >
              <label style={{ marginRight: "0.8rem" }}>Môn học</label>
              <div style={{ width: "18rem" }}>
                <Select
                  onChange={(e) => {
                    filtersRef.current.monHoc = e.value;
                    filtersData.monHoc = e.value?.trim();
                    filtersData.tenMH = e.label?.trim();
                  }}
                  options={dsMonHoc}
                ></Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button
          onClick={() => {
            setFilters(filtersData);
            inDiemLopTC(filtersData);
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
