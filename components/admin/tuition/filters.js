import React, { useEffect, useState } from "react";
import Select from "react-select";
import Table from "./table";
import TableDetail from "./tableDetail";
import { adminApi } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";

export default function Filters() {
  const customInputStyle = {
    height: "65%",
    marginTop: "0.4rem",
    marginLeft: "0.3rem",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
  };
  const dbConfig = JSON.parse(localStorage.getItem("currentDB"));

  const [maSV, setMaSV] = useState();

  const [SVInfo, setSVInfo] = useState();
  // lấy ds học phí
  const laySinhVien = async () => {
    const payload = {
      ...dbConfig,
      MASV: maSV,
    };
    try {
      const res = await adminApi.laySinhVien(payload);
      if (res.data) {
        setSVInfo(res.data[0]);
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

  const dongHocPhi = async (dsHocPhi, dsCTHocPhi) => {
    const payload = {
      ...dbConfig,
      dsHocPhi: dsHocPhi ?? [],
      dsCTHocPhi: dsCTHocPhi ?? [],
    };
    try {
      const res = await adminApi.dongHocPhi(payload);
      if (res.data) {
        toast.success("Đã lưu học phí vào CSDL", {
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
  const [refreshFilter, setRefreshFilter] = useState(false);
  const [hocPhi, setHocPhi] = useState();
  const [refreshCtHocPhi, setRefreshCtHocPhi] = useState();

  const [currentDsHocPhi, setCurrentDsHocPhi] = useState([]);
  const [currentNopHocPhi, setCurrentNopHocPhi] = useState([]);
  const [refreshTableHP, setRefreshTableHP] = useState(false);
  const [refreshTableCT, setRefreshTableCT] = useState(false);

  return (
    <>
      <div style={{ backgroundColor: "#c2bdbd", position: "relative" }}>
        <div style={{ textAlign: "center" }}>
          <h3>HỌC PHÍ</h3>
        </div>

        <div style={{ paddingLeft: "15rem" }}>
          <div style={{ position: "relative" }}>
            <h4>Thông tin sinh viên</h4>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                }}
              >
                <label style={{ marginRight: "2rem" }}>Mã sinh viên</label>
                <input
                  defaultValue={SVInfo?.MASV}
                  onChange={(e) => setMaSV(e.target.value)}
                  style={customInputStyle}
                ></input>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginLeft: "3rem",
                }}
              >
                <label style={{ marginRight: "2rem" }}>Tên sinh viên</label>

                <input
                  defaultValue={SVInfo?.HOTEN}
                  style={customInputStyle}
                ></input>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  marginLeft: "3rem",
                }}
              >
                <label style={{ marginRight: "2rem" }}>Mã lớp</label>
                <input
                  defaultValue={SVInfo?.MALOP}
                  style={customInputStyle}
                ></input>
              </div>
              <button
                className="buttonLogic"
                style={{
                  float: "none",
                  marginRight: "2rem",
                  marginLeft: "2rem",
                }}
                onClick={() => {
                  setRefreshFilter(!refreshFilter);
                  setHocPhi();
                  laySinhVien();
                }}
              >
                Tìm
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <button
            className="buttonLogic"
            style={{ float: "none", marginRight: "2rem" }}
          >
            cập nhật
          </button>
          <button
            className="buttonLogic"
            style={{ float: "none", margin: "0 auto" }}
          >
            xóa
          </button>
        </div>
      </div>
      <div key={refreshFilter}>
        <div style={{ marginBottom: "2rem" }}>
          <Table
            refreshTableHP={refreshTableHP}
            setRefreshTableHP={setRefreshTableHP}
            setCurrentDsHocPhi={setCurrentDsHocPhi}
            currentDsHocPhi={currentDsHocPhi}
            refreshCtHocPhi={refreshCtHocPhi}
            setRefreshCtHocPhi={setRefreshCtHocPhi}
            setHocPhi={setHocPhi}
            SVInfo={SVInfo}
          />
        </div>
        <div key={refreshCtHocPhi}>
          <TableDetail
            refreshTableHP={refreshTableHP}
            setRefreshTableHP={setRefreshTableHP}
            refreshTableCT={refreshTableCT}
            setRefreshTableCT={setRefreshTableCT}
            setCurrentDsHocPhi={setCurrentDsHocPhi}
            currentDsHocPhi={currentDsHocPhi}
            currentNopHocPhi={currentNopHocPhi}
            setCurrentNopHocPhi={setCurrentNopHocPhi}
            hocPhi={hocPhi}
            SVInfo={SVInfo}
          />
        </div>

        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button
            className="buttonLogic"
            style={{ float: "none" }}
            onClick={() => {
              // ghiDiemSV(currentDetail);
              let list = [];
              for (let i = 0; i < currentDsHocPhi.length; i++) {
                currentDsHocPhi[i]?.CTHocPhi?.forEach((e) => {
                  if (!e.CSDL)
                    list.push({
                      MASV: currentDsHocPhi[i].MASV,
                      NIENKHOA: currentDsHocPhi[i].NIENKHOA,
                      HOCKY: currentDsHocPhi[i].HOCKY,
                      NGAYDONG: e.NGAYDONG,
                      SOTIENDONG: e.SOTIENDONG,
                    });
                });
              }
              dongHocPhi(
                currentDsHocPhi?.filter((x) => !x.CSDL),
                list
              );
            }}
          >
            Ghi thông tin về CSDL
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
