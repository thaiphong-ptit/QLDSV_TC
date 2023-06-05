import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { adminApi } from "../../services/adminService";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function TableDetail(props) {
  const dbConfig = JSON.parse(localStorage.getItem("currentDB"));

  const {
    filters,
    filtersRefs,
    setShowEditForm,
    showEditForm,
    detail,
    tableKey,
  } = props;
  const rowClass = "rowSelected";

  const dsKhoa = JSON.parse(localStorage.getItem("dsPhanManh")).slice(0, 2);

  // login phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(5);
  const [dsLopTCDK, setDsLopTCDK] = useState();

  const handleChangePageSize = (e) => {
    setCurrentPageSize(e.target.value);
  };

  const handleClickNext = () => {
    let page = currentPage + 1;

    setCurrentPage(page);
  };

  const handleClickPrevious = () => {
    if (currentPage > 1) {
      let page = currentPage - 1;
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    let prevbtn = document.getElementById("lopTCSVDK_prev-btn");
    if (currentPage === 1) prevbtn.disabled = true;
    else prevbtn.disabled = false;

    let nextbtn = document.getElementById("lopTCSVDK_next-btn");
    if (dsLopTCDK?.length < currentPageSize) nextbtn.disabled = true;
    else nextbtn.disabled = false;
  }, [currentPage, dsLopTCDK?.length]);

  const layDsLopTCSvDk = async () => {
    const payload = {
      ...dbConfig,
      ...filters,
      maSv: "N15DCCN001",
      pageSize: currentPageSize,
      pageNumber: currentPage,
    };
    try {
      const res = await adminApi.layDsLopTCSVDK(payload);
      if (res.data) {
        setDsLopTCDK(res.data);
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

  const [selectedRow, setSelectRow] = useState(0);

  const [showActionButton, setShowActionButton] = useState({
    model: {},
    show: false,
    index: null,
  });

  // const [showEditForm, setShowEditForm] = useState({
  //   model: {},
  //   show: false,
  //   index: null,
  // });
  const [refreshEditForm, setRefreshEditForm] = useState(false);
  useEffect(() => {
    filters.nienKhoa !== null && filters.hocKy !== null && layDsLopTCSvDk();
  }, [filters, currentPage, currentPageSize]);
  useEffect(() => {
    setShowEditForm({
      model: {},
      show: false,
      index: null,
    });
  }, [refreshEditForm]);

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          backgroundColor: "rgb(206, 199, 199)",
        }}
      >
        <label>Danh sách Lớp tín chỉ đã đang ký</label>
      </div>
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tr
            style={{
              backgroundColor: "rgb(114, 152, 185)",
            }}
          >
            <td style={{ width: "4rem" }}></td>
            <td>Mã lớp tín chỉ </td>
            <td>Niên khóa</td>
            <td>Học kỳ</td>
            <td>Tên môn học</td>
            <td>Nhóm</td>
            <td>Giảng viên</td>
          </tr>

          {dsLopTCDK?.map((x, index) => (
            <tr
              onClick={() => {
                dsLopTCDK?.forEach((e, i) => {
                  if (i !== index)
                    document
                      .getElementById(`lopTCSVDK_${i}`)
                      .classList.remove(rowClass);
                });
                document
                  .getElementById(`lopTCSVDK_${index}`)
                  .classList.add(rowClass);
                setSelectRow(index);
              }}
              id={`lopTCSVDK_${index}`}
              className={selectedRow === index ? rowClass : ""}
              key={`lopTCSVDK_${x.MALOP}`}
            >
              <td
                style={{
                  width: "4rem",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                {x?.COTHEHUY ? (
                  <div
                    style={{ width: "100%" }}
                    onClick={() => {
                      setShowActionButton({
                        model: x,
                        show: true,
                        index: index,
                      });
                    }}
                    onBlur={() => {
                      setShowActionButton({
                        model: {},
                        show: false,
                        index: null,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} />

                    {showActionButton?.show &&
                      showActionButton?.index === index && (
                        <div
                          style={{
                            width: "7rem",
                            position: "absolute",
                            left: "3rem",
                            zIndex: "100",
                          }}
                        >
                          <button className="buttonCustom">Hủy lớp </button>
                        </div>
                      )}
                  </div>
                ) : (
                  <></>
                )}
              </td>
              <td>{x.MALTC}</td>
              <td>{x.NIENKHOA}</td>
              <td>{x.HOCKY}</td>
              <td>{x.TENMH}</td>
              <td>{x.NHOM}</td>
              <td>{x.TENGV}</td>
            </tr>
          ))}
        </table>
      </div>
      {/* Phân trang  */}
      <div class="pagination-container">
        <div class="page-size">
          <label for="page-size-select">Page Size:</label>
          <select
            onChange={(e) => handleChangePageSize(e)}
            id="page-size-select"
            defaultValue={currentPageSize}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </div>
        <div class="page-number">
          <button
            id="lopTCSVDK_prev-btn"
            onClick={handleClickPrevious}
            className="prev-btn buttonLogic"
          >
            Quay lại
          </button>
          <span id="current-page">{currentPage}</span>
          <button
            id="lopTCSVDK_next-btn"
            onClick={handleClickNext}
            className="next-btn buttonLogic"
          >
            Tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
