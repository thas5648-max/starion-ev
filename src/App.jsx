import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";

export default function App() {
  const [language, setLanguage] = useState("es");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const lateTime = "07:30:00";
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  useEffect(() => {
  if (loggedIn) {
    loadAttendance(selectedDate);
  }
}, [selectedDate, loggedIn]);

  const text = {
    es: {
      title: "STARION EV",
      employeeId: "Número de empleado",
      password: "Contraseña",
      login: "Iniciar sesión",
      welcome: "Bienvenido",
      attendance: "Registrar asistencia",
      invalid: "Usuario o contraseña incorrectos",
    },
    ko: {
      title: "STARION EV",
      employeeId: "사번",
      password: "비밀번호",
      login: "로그인",
      welcome: "환영합니다",
      attendance: "출근 등록",
      invalid: "사번 또는 비밀번호가 올바르지 않습니다",
    },
  };

  const t = text[language];

  const filteredEmployees =
  selectedDepartment === "전체"
    ? employeeList
    : employeeList.filter(
        emp => emp.department === selectedDepartment
      );

const filteredAttendance =
  selectedDepartment === "전체"
    ? attendanceList
    : attendanceList.filter(
        item =>
          item.employees?.department === selectedDepartment
      );

const attendanceRate =
  filteredEmployees.length > 0
    ? (
        (filteredAttendance.length /
          filteredEmployees.length) *
        100
      ).toFixed(1)
    : 0;

const absentEmployees =
  filteredEmployees.filter(
    emp =>
      !filteredAttendance.some(
        att =>
          att.employee_id === emp.employee_id
      )
  );

  async function handleLogin() {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("employee_id", employeeId)
      .eq("password_hash", password)
      .single();

    if (error || !data) {
      alert(t.invalid);
      return;
    }

    setUserRole(data.role);

    setUserName(data.name);
    setCurrentEmployeeId(data.employee_id);
    setUserRole(data.role);

const { data: employees } = await supabase
  .from("employees")
  .select("*")
  .eq("active", true);

setEmployeeList(employees || []);

setLoggedIn(true);
  }

  if (loggedIn && userRole === "employee") {

  return (
    <div className="container">
      <div className="login-card">

        <h1>{t.welcome}</h1>

        <h2>{userName}</h2>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        />

        <button
          className="action-btn checkin-btn"
          onClick={handleCheckIn}
        >
          {t.attendance}
        </button>

        <button
          className="action-btn checkout-btn"
          onClick={handleCheckOut}
        >
          퇴근 등록
        </button>

        <button
          className="action-btn logout-btn"
          onClick={() => {
            setLoggedIn(false);
            setUserName("");
            setUserRole("");
            setCurrentEmployeeId("");
          }}
        >
          로그아웃
        </button>

        <h3>내 출근 기록</h3>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>출근</th>
              <th>퇴근</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            {attendanceList
              .filter(
                item =>
                  item.employee_id ===
                  currentEmployeeId
              )
              .map(item => (
                <tr key={item.id}>
                  <td>{item.attendance_date}</td>

                  <td>
                    {item.check_in
                      ? new Date(
                          item.check_in
                        ).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    {item.check_out
                      ? new Date(
                          item.check_out
                        ).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>{item.status}</td>
                </tr>
              ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
  if (loggedIn) {

    return (
      <div className="container">
        <div className="login-card">
          <h1>{t.welcome}</h1>

          <h2>{userName}</h2>
          <h3>ROLE: {userRole}</h3>
          <input
            type="date"
            value={selectedDate}
             onChange={(e) => {
    setSelectedDate(e.target.value);
  }}
          />

          <button
  className="action-btn checkin-btn"
  onClick={handleCheckIn}
>
            {t.attendance}
          </button>
          <button
  className="action-btn checkout-btn"
  onClick={handleCheckOut}
>
            퇴근 등록
          </button>
          <div className="bottom-buttons">

  <button
    className="action-btn employee-btn"
    onClick={() =>
      setShowEmployeeForm(!showEmployeeForm)
    }
  >
    직원 등록 열기
  </button>

  <button
    className="action-btn logout-btn"
    onClick={() => {
      setLoggedIn(false);
      setUserName("");
      setUserRole("");
      setCurrentEmployeeId("");
    }}
  >
    로그아웃
  </button>

</div>
          {userRole === "admin" && showEmployeeForm && (
  <>

    {showEmployeeForm && (
      <>
        <h3>직원 등록</h3>

        <input
          placeholder="사번"
          value={newEmployeeId}
          onChange={(e) =>
            setNewEmployeeId(e.target.value)
          }
        />

        <input
          placeholder="이름"
          value={newEmployeeName}
          onChange={(e) =>
            setNewEmployeeName(e.target.value)
          }
        />

        <input
          placeholder="비밀번호"
          value={newEmployeePassword}
          onChange={(e) =>
            setNewEmployeePassword(e.target.value)
          }
        />

        <input
          placeholder="부서"
          value={newEmployeeDepartment}
          onChange={(e) =>
            setNewEmployeeDepartment(e.target.value)
          }
        />

        <button
          className="login-btn"
          onClick={handleCreateEmployee}
        >
          직원 등록
        </button>
      </>
    )}
  </>
)}

<select
  value={selectedDepartment}
  onChange={(e) =>
    setSelectedDepartment(e.target.value)
  }
>
  <option value="전체">전체</option>
  <option value="인사">인사</option>
  <option value="구매">구매</option>
  <option value="영업">영업</option>
  <option value="사출">사출</option>
  <option value="조립">조립</option>
  <option value="프레스">프레스</option>
  <option value="전착">전착</option>
  <option value="프레스조립">프레스조립</option>
  <option value="증착도장">증착도장</option>
</select>
          <h3>{selectedDate} 근태 현황</h3>

          <div className="summary-grid">

  <div className="summary-card">
    <h4>전체 인원</h4>
    <p>{filteredEmployees.length}</p>
  </div>

  <div className="summary-card">
    <h4>출근 인원</h4>
    <p>{filteredAttendance.length}</p>
  </div>

  <div className="summary-card">
    <h4>미출근 인원</h4>
    <p>
      {filteredEmployees.length -
        filteredAttendance.length}
    </p>
  </div>

  <div className="summary-card">
    <h4>출근율</h4>
    <p>{attendanceRate}%</p>
  </div>

</div>

<h3>미출근자</h3>

<ul>
  {absentEmployees.map(emp => (
    <li key={emp.employee_id}>
      {emp.name}
    </li>
  ))}
</ul>

          <h3>LIST COUNT : {filteredAttendance.length}</h3>

<table className="attendance-table">
  <thead>
    <tr>
      <th>사번</th>
      <th>이름</th>
      <th>출근시간</th>
      <th>퇴근시간</th>
      <th>상태</th>
    </tr>
  </thead>

  <tbody>
    {attendanceList
  .filter((item) =>
    selectedDepartment === "전체"
      ? true
      : item.employees?.department === selectedDepartment
  )
  .map((item) => (
      <tr key={item.id}>
        <td>{item.employee_id}</td>

        <td>{item.employees?.name || "-"}</td>

        <td>
          {item.check_in
            ? new Date(item.check_in).toLocaleTimeString()
            : "-"}
        </td>

        <td>
          {item.check_out
            ? new Date(item.check_out).toLocaleTimeString()
            : "-"}
        </td>

        <td
  style={{
    color:
      item.status === "퇴근"
        ? "gray"
        : (
            item.check_in &&
            new Date(item.check_in)
              .toLocaleTimeString("en-GB")
              .slice(0, 8) > lateTime
          )
        ? "red"
        : "green",
    fontWeight: "bold",
  }}
>
  {
    item.check_in &&
    new Date(item.check_in)
      .toLocaleTimeString("en-GB")
      .slice(0, 8) > lateTime
      ? "지각"
      : item.status
  }
</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="login-card">
        <h1>{t.title}</h1>

        <div className="lang-buttons">
          <button onClick={() => setLanguage("es")}>
            Español
          </button>

          <button onClick={() => setLanguage("ko")}>
            한국어
          </button>
        </div>

        <input
          type="text"
          placeholder={t.employeeId}
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        <input
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={handleLogin}
        >
          {t.login}
        </button>
      </div>
    </div>
  );



  async function handleCheckIn() {

    const position = await new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject
      );

    });

    const currentLat = position.coords.latitude;
    const currentLng = position.coords.longitude;
    const { data: companyData } = await supabase
      .from("company_settings")
      .select("*");

    const company = companyData?.[0];

    if (!company) {
      alert("회사 위치 정보 없음");
      return;
    }
    const distance = Math.sqrt(
      Math.pow(currentLat - company.latitude, 2) +
      Math.pow(currentLng - company.longitude, 2)
    ) * 111000;

    alert(`현재거리 : ${Math.round(distance)}m`);

    if (distance > company.radius_m) {

      alert(
        `회사 반경 밖입니다.
현재 거리 : ${Math.round(distance)}m`
      );

      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("attendance")
      .select("*")
      .eq("employee_id", currentEmployeeId)
      .eq("attendance_date", today);

    if (existing && existing.length > 0) {
      alert("오늘 이미 출근하셨습니다.");
      return;
    }

    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          employee_id: currentEmployeeId,
          attendance_date: today,
          check_in: new Date().toISOString(),
          status: "출근"
        }
      ])
      .select();


    if (error) {
      alert("출근 등록 실패");
      return;
    }

    await loadAttendance(selectedDate);

    alert("출근 등록 완료");
  }

  async function loadAttendance(date) {

    const { data, error } = await supabase
      .from("attendance")
      .select(`
    *,
   employees (
  name,
  department
)
  `)
      .eq("attendance_date", date);
    if (error) {
      console.log(error);
      return;
    }

    setAttendanceList(data);

  }


  async function handleCheckOut() {

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("attendance")
      .update({
        check_out: new Date().toISOString(),
        status: "퇴근"
      })
      .eq("employee_id", currentEmployeeId)
      .eq("attendance_date", today);

    if (error) {
      console.log(error);
      alert("퇴근 등록 실패");
      return;
    }

    await loadAttendance(selectedDate);

    alert("퇴근 등록 완료");
  }
  async function handleCreateEmployee() {

    const { error } = await supabase
      .from("employees")
      .insert([
        {
          employee_id: newEmployeeId,
          password_hash: newEmployeePassword,
          name: newEmployeeName,
          department: newEmployeeDepartment,
          role: "employee",
          active: true
        }
      ]);

    if (error) {
      console.log(error);
      alert("직원 등록 실패");
      return;
    }

    alert("직원 등록 완료");

    setNewEmployeeId("");
    setNewEmployeeName("");
    setNewEmployeePassword("");
    setNewEmployeeDepartment("");
  }
}