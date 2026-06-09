import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./App.css";

export default function App() {
  const [language, setLanguage] = useState("es");
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const deviceToken =
  localStorage.getItem("device_token") ||
  crypto.randomUUID();
console.log("DEVICE TOKEN =", deviceToken);
  localStorage.setItem(
  "device_token",
  deviceToken
);

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  const [showMyInfo,
  setShowMyInfo] =
  useState(false);

const [currentPassword,
  setCurrentPassword] =
  useState("");

const [newPassword,
  setNewPassword] =
  useState("");

const [confirmPassword,
  setConfirmPassword] =
  useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const dayShiftLateTime = "07:30:00";
const nightShiftLateTime = "19:30:00";
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeDepartment, setNewEmployeeDepartment] = useState("");
  const [newEmployeeShift,
setNewEmployeeShift] =
useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
const [showAbsentList, setShowAbsentList] =
  useState(false);

const [showLateList, setShowLateList] =
  useState(false);
  useEffect(() => {
  if (loggedIn) {
    loadAttendance(selectedDate);
  }
}, [selectedDate, loggedIn]);

const [showDepartmentStats, setShowDepartmentStats] =
  useState(false);
const [showAttendanceTable, setShowAttendanceTable] =
  useState(false);
const [activeTab, setActiveTab] =
  useState("attendance");
  const [searchText, setSearchText] =
  useState("");
  const [selectedEmployee,
  setSelectedEmployee] =
  useState(null);
  const [editDepartment,
  setEditDepartment] =
  useState("");

const [editShift,
  setEditShift] =
  useState("");
  const text = {
    es: {
      title: "STARION EV",
      employeeId: "Número de empleado",
      password: "Contraseña",
      login: "Iniciar sesión",
      welcome: "Bienvenido",
      attendance: "Registrar asistencia",
      invalid: "Usuario o contraseña incorrectos",
      changePassword: "Cambiar contraseña",
currentPassword: "Contraseña actual",
newPassword: "Nueva contraseña",
confirmPassword: "Confirmar contraseña",

myInfo: "Mi información",

employeeManagement: "Administración de empleados",

department: "Departamento",
shift: "Turno",

save: "Guardar",
retire: "Dar de baja",
attendanceStatus: "Estado de asistencia",

allEmployees: "Total de empleados",
presentEmployees: "Presentes",
absentEmployees: "Ausentes",
attendanceRate: "Porcentaje de asistencia",

departmentAttendance: "Asistencia por departamento",

dayShiftStatus: "Turno diurno",
nightShiftStatus: "Turno nocturno",

total: "Total",
present: "Presentes",
absent: "Ausentes",

attendanceRecords: "Registros de asistencia",
lateEmployees: "Llegadas tarde",

logout: "Cerrar sesión",
checkout: "Registrar salida",
employeeRegister: "Registrar empleado",
all: "Todos",
persons: "personas",
role: "Rol",
absentList: "Ausentes",
departmentHeader: "Departamento",
presentHeader: "Presentes",
totalHeader: "Total",
attendanceRateHeader: "% Asistencia",
employeeName: "Nombre",
selectDepartment: "Seleccionar departamento",
selectShift: "Seleccionar turno",
myAttendance: "Mis registros",
departments: {
  "인사": "Recursos Humanos",
  "구매": "Compras",
  "영업": "Ventas",
  "사출": "Inyección",
  "조립": "Ensamble",
  "프레스": "Prensa",
  "전착": "Electrodeposición",
  "프레스조립": "Prensa y Ensamble",
  "증착도장": "Recubrimiento"
},
employeeSearch: "🔍 Buscar nombre o número",
dayShift: "Turno diurno",
nightShift: "Turno nocturno",
records: "registros",
    },
    ko: {
      title: "STARION EV",
      employeeId: "사번",
      password: "비밀번호",
      login: "로그인",
      welcome: "환영합니다",
      attendance: "출근 등록",
      invalid: "사번 또는 비밀번호가 올바르지 않습니다",
      changePassword: "비밀번호 변경",
currentPassword: "현재 비밀번호",
newPassword: "새 비밀번호",
confirmPassword: "새 비밀번호 확인",

myInfo: "내 정보",

employeeManagement: "직원관리",

department: "부서",
shift: "근무조",

save: "저장",
retire: "퇴사 처리",
attendanceStatus: "근태현황",

allEmployees: "전체 인원",
presentEmployees: "출근 인원",
absentEmployees: "미출근 인원",
attendanceRate: "출근율",

departmentAttendance: "부서별 출근 현황",

dayShiftStatus: "주간조 현황",
nightShiftStatus: "야간조 현황",

total: "전체",
present: "출근",
absent: "결근",

attendanceRecords: "근태기록",
lateEmployees: "지각자",

logout: "로그아웃",
checkout: "퇴근 등록",
employeeRegister: "직원 등록 열기",
all: "전체",
persons: "명",
role: "권한",
absentList: "미출근자",
employeeName: "이름",
selectDepartment: "부서 선택",
selectShift: "근무조 선택",
myAttendance: "내 출근 기록",
departments: {
  "인사": "인사",
  "구매": "구매",
  "영업": "영업",
  "사출": "사출",
  "조립": "조립",
  "프레스": "프레스",
  "전착": "전착",
  "프레스조립": "프레스조립",
  "증착도장": "증착도장"
},
employeeSearch: "🔍 이름 또는 사번 검색",
dayShift: "주간",
nightShift: "야간",
records: "건",
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

  const lateEmployees =
  filteredAttendance.filter(item => {

    if (!item.check_in) return false;

    const checkTime =
      new Date(item.check_in)
        .toLocaleTimeString("en-GB")
        .slice(0, 8);

    const shift =
      item.employees?.shift;

    if (shift === "야간") {
      return checkTime >
        nightShiftLateTime;
    }

    return checkTime >
      dayShiftLateTime;
  });

const normalEmployees =
  filteredAttendance.filter(
    item =>
      !lateEmployees.some(
        late =>
          late.employee_id === item.employee_id
      )
  );
  const dayEmployees =
  filteredEmployees.filter(
    emp => emp.shift === "주간"
  );

const nightEmployees =
  filteredEmployees.filter(
    emp => emp.shift === "야간"
  );

const dayAttendance =
  filteredAttendance.filter(
    item =>
      item.employees?.shift === "주간"
  );

const nightAttendance =
  filteredAttendance.filter(
    item =>
      item.employees?.shift === "야간"
  );

  const filteredEmployeeList =
  employeeList.filter(emp =>
    emp.name
      .toLowerCase()
      .includes(
        searchText.toLowerCase()
      ) ||
    emp.employee_id
      .toLowerCase()
      .includes(
        searchText.toLowerCase()
      )
  );

const departmentStats = [
  "인사",
  "구매",
  "영업",
  "사출",
  "조립",
  "프레스",
  "전착",
  "프레스조립",
  "증착도장"
].map(dept => {

  const total =
    employeeList.filter(
      emp => emp.department === dept
    ).length;

  const present =
    filteredAttendance.filter(
      att =>
        att.employees?.department === dept
    ).length;

  return {
    dept,
    total,
    present
  };
});

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

    const { data: deviceData } = await supabase
  .from("employee_devices")
  .select("*")

  if (deviceData && deviceData.length > 0) {

 const isMaster =
  deviceData.some(
    d =>
      d.is_master === true &&
      d.device_token === deviceToken
  );
  
  if (!isMaster) {

    const registered =
      deviceData.find(
        d =>
          d.device_token === deviceToken
      );

   if (!registered) {

  const registerDevice = confirm(
    "등록되지 않은 기기입니다.\n현재 기기를 등록하시겠습니까?"
  );

  if (!registerDevice) {
    return;
  }

  await supabase
    .from("employee_devices")
    .insert([
      {
        employee_id: employeeId,
        device_token: deviceToken,
        is_master: false
      }
    ]);
}
  }
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

if (
  !deviceData ||
  deviceData.length === 0
) {

  const registerDevice =
    confirm(
      "현재 기기를 등록하시겠습니까?"
    );

  if (!registerDevice) {
    return;
  }

  await supabase
    .from("employee_devices")
    .insert([
      {
        employee_id: employeeId,
        device_token: deviceToken,
        is_master: false
      }
    ]);
}

setLoggedIn(true);
  }

  if (loggedIn && userRole === "employee") {

  return (
    <div className="container">
      <div className="login-card">

        <div className="starion-header">

  <h1>STARION EV</h1>

  <p>
    Attendance Management System
  </p>

</div>

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
          {t.checkout}
        </button>

<button
  className="action-btn employee-btn"
  onClick={() =>
    setShowMyInfo(
      !showMyInfo
    )
  }
>
  ⚙️ {t.myInfo}
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
          {t.logout}
        </button>

{showMyInfo && (
  <>
    <h3>{t.changePassword}</h3>

    <input
      type="password"
      placeholder={t.currentPassword}
      value={currentPassword}
      onChange={(e) =>
        setCurrentPassword(
          e.target.value
        )
      }
    />

    <input
      type="password"
      placeholder={t.newPassword}
      value={newPassword}
      onChange={(e) =>
        setNewPassword(
          e.target.value
        )
      }
    />

    <input
      type="password"
      placeholder="새 비밀번호 확인"
      value={confirmPassword}
      onChange={(e) =>
        setConfirmPassword(
          e.target.value
        )
      }
    />

    <button
      className="login-btn"
      onClick={
        handleChangePassword
      }
    >
      비밀번호 변경
    </button>
  </>
)}


        <h3>{t.myAttendance}</h3>

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
          <div className="starion-header">

  <h1>STARION EV</h1>

  <p>
    Attendance Management System
  </p>

</div>

<h2>{userName}</h2>

{activeTab === "employees" && (
  <>
    <h2>👥 {t.employeeManagement}</h2>
   <input
  type="text"
  placeholder={t.employeeSearch}
  value={searchText}
  onChange={(e) =>
    setSearchText(e.target.value)
  }
  style={{
    width: "100%",
    display: "block",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "2px solid #9b003f",
    fontSize: "16px",
    background: "white",
    color: "black",
    boxSizing: "border-box"
  }}
/>

    {filteredEmployeeList.map(emp => (
  <div
  key={emp.employee_id}
  onClick={() => {
  setSelectedEmployee(emp);

  setEditDepartment(
    emp.department || ""
  );

  setEditShift(
    emp.shift || ""
  );

  setEditActive(
    emp.active
  );
}}
  style={{
    border:
      selectedEmployee?.employee_id === emp.employee_id
        ? "2px solid #9b003f"
        : "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background:
      selectedEmployee?.employee_id === emp.employee_id
        ? "#fff5f8"
        : "white"
  }}
>
    <b>{emp.employee_id}</b>

    <br />

    {emp.name}

    <br />

    {t.departments[emp.department]} / {emp.shift}
    {selectedEmployee?.employee_id === emp.employee_id && (
  <div
    style={{
      marginTop: "10px",
      borderTop: "1px solid #ddd",
      paddingTop: "10px"
    }}
  >

    <p>{t.department}</p>

    <select
      value={editDepartment}
      onChange={(e) =>
        setEditDepartment(
          e.target.value
        )
      }
    >
      <option value="인사">{t.departments["인사"]}</option>
<option value="구매">{t.departments["구매"]}</option>
<option value="영업">{t.departments["영업"]}</option>
<option value="사출">{t.departments["사출"]}</option>
<option value="조립">{t.departments["조립"]}</option>
<option value="프레스">{t.departments["프레스"]}</option>
<option value="전착">{t.departments["전착"]}</option>
<option value="프레스조립">{t.departments["프레스조립"]}</option>
<option value="증착도장">{t.departments["증착도장"]}</option>
    </select>

    <p>{t.shift}</p>

    <select
      value={editShift}
      
      onChange={(e) =>
        setEditShift(
          e.target.value
        )
      }
    >
     <option value="주간">
  {t.dayShift}
</option>

<option value="야간">
  {t.nightShift}
</option>
    </select>

    <button
      className="login-btn"
      onClick={() =>
        handleUpdateEmployee(
          emp.employee_id
        )
      }
    >
      {t.save}
    </button>
<button
  className="logout-btn"
  onClick={() =>
    handleRetireEmployee(
      emp.employee_id
    )
  }
>
 {t.retire}
  </button>
  </div>
)}
  </div>
))}

  </>
)}
{activeTab === "attendance" && (
<>
<h3>
  {t.role}: {userRole}
</h3>
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
            {t.checkout}
          </button>
          <div className="bottom-buttons">

  <button
    className="action-btn employee-btn"
    onClick={() =>
      setShowEmployeeForm(!showEmployeeForm)
    }
  >
    {t.employeeRegister}
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
    {t.logout}
  </button>

</div>
          {userRole === "admin" && showEmployeeForm && (
  <>

    {showEmployeeForm && (
      <>
        <h3>{t.employeeRegister}</h3>

        <input
          placeholder={t.employeeId}
          value={newEmployeeId}
          onChange={(e) =>
            setNewEmployeeId(e.target.value)
          }
        />

        <input
          placeholder={t.employeeName}
          value={newEmployeeName}
          onChange={(e) =>
            setNewEmployeeName(e.target.value)
          }
        />

<div className="employee-selects">
        <select
  value={newEmployeeDepartment}
  onChange={(e) =>
    setNewEmployeeDepartment(
      e.target.value
    )
  }
>
  <option value="">
  {t.selectDepartment}
</option>

  <option value="인사">{t.departments["인사"]}</option>
<option value="구매">{t.departments["구매"]}</option>
<option value="영업">{t.departments["영업"]}</option>
<option value="사출">{t.departments["사출"]}</option>
<option value="조립">{t.departments["조립"]}</option>
<option value="프레스">{t.departments["프레스"]}</option>
<option value="전착">{t.departments["전착"]}</option>
<option value="프레스조립">{t.departments["프레스조립"]}</option>
<option value="증착도장">{t.departments["증착도장"]}</option>
</select>
<select
  value={newEmployeeShift}
  onChange={(e) =>
    setNewEmployeeShift(
      e.target.value
    )
  }
>
  <option value="">
  {t.selectShift}
</option>

  <option value="주간">
  {t.dayShift}
</option>

<option value="야간">
  {t.nightShift}
</option>
</select>

</div>

<input
  type="password"
  placeholder={t.password}
  value={newEmployeePassword}
  onChange={(e) =>
    setNewEmployeePassword(
      e.target.value
    )
  }
/>

        <button
          className="login-btn"
          onClick={handleCreateEmployee}
        >
          {t.employeeRegister}
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
 <option value="전체">
  {t.all}
</option>
</select>
          <h3> {selectedDate} {t.attendanceStatus}</h3>

          <div className="summary-grid">

  <div className="summary-card">
    <h4>{t.allEmployees}</h4>
    <p>{filteredEmployees.length}</p>
  </div>

  <div className="summary-card">
    <h4>{t.presentEmployees}</h4>
    <p>{filteredAttendance.length}</p>
  </div>

  <div className="summary-card">
    <h4>{t.absentEmployees}</h4>
    <p>
      {filteredEmployees.length -
        filteredAttendance.length}
    </p>
  </div>

  <div className="summary-card">
    <h4>{t.attendanceRate}</h4>
    <p>{attendanceRate}%</p>
  </div>

</div>

<h3
  style={{ cursor: "pointer" }}
  onClick={() =>
    setShowDepartmentStats(
      !showDepartmentStats
    )
  }
>
  {t.departmentAttendance}
({departmentStats.length})
  {showDepartmentStats ? " ▲" : " ▼"}
</h3>

{showDepartmentStats && (

<table className="attendance-table">
  <thead>
    <tr>
      <th>{t.departmentHeader}</th>
<th>{t.presentHeader}</th>
<th>{t.totalHeader}</th>
<th>{t.attendanceRateHeader}</th>
    </tr>
  </thead>

  <tbody>
    {departmentStats.map(d => (
      <tr key={d.dept}>

        <td>{t.departments[d.dept]}</td>

        <td>{d.present}</td>

        <td>{d.total}</td>

        <td>
          {d.total > 0
            ? (
                (d.present / d.total) *
                100
              ).toFixed(1)
            : 0}
          %
        </td>

      </tr>
    ))}
  </tbody>
</table>

)}

<h3>🌞 {t.dayShiftStatus} </h3>

<p>
  {t.total} : {dayEmployees.length} {t.persons}
  </p>
<p>
  {t.present} :  {dayAttendance.length}{t.persons}
  </p>
<p>
  {t.absent} : {dayEmployees.length - dayAttendance.length}{t.persons}
  </p>

<hr />

<h3>🌙 {t.nightShiftStatus}</h3>

<p>{t.total} : {nightEmployees.length} {t.persons}</p>
<p>{t.present} : : {nightAttendance.length}{t.persons}</p>
<p>{t.absent} : {nightEmployees.length - nightAttendance.length}{t.persons}</p>

<h3
  style={{ cursor: "pointer" }}
  onClick={() =>
    setShowAbsentList(!showAbsentList)
  }
>
  {t.absentList} ({absentEmployees.length}{t.persons})
  {showAbsentList ? " ▲" : " ▼"}
</h3>

{showAbsentList && (
  <ul>
    {absentEmployees.map(emp => (
      <li key={emp.employee_id}>
        {emp.name}
      </li>
    ))}
  </ul>
)}

<h3
  style={{ cursor: "pointer" }}
  onClick={() =>
    setShowLateList(!showLateList)
  }
>
  {t.lateEmployees} ({lateEmployees.length}{t.persons})
  {showLateList ? " ▲" : " ▼"}
</h3>

{showLateList && (
  <ul>
    {lateEmployees.map(item => (
      <li key={item.id}>
        {item.employees?.name}
      </li>
    ))}
  </ul>
)}

<h3
  style={{ cursor: "pointer" }}
  onClick={() =>
    setShowAttendanceTable(
      !showAttendanceTable
    )
  }
>
  {t.attendanceRecords}
({filteredAttendance.length}{t.records})
  {showAttendanceTable ? " ▲" : " ▼"}
</h3>

{showAttendanceTable && (
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
            ? new Date(item.check_in).toLocaleTimeString(
  "ko-KR",
  {
    timeZone: "America/Monterrey"
  }
)
            : "-"}
        </td>

        <td>
          {item.check_out
            ? new Date(item.check_out).toLocaleTimeString(
  "ko-KR",
  {
    timeZone: "America/Monterrey"
  }
)
            : "-"}
        </td>

        <td
  style={{
    color:
      item.status === "퇴근"
        ? "gray"
        : (
  item.employees?.shift === "야간"
    ? new Date(item.check_in)
        .toLocaleTimeString("en-GB")
        .slice(0, 8) >
      nightShiftLateTime
    : new Date(item.check_in)
        .toLocaleTimeString("en-GB")
        .slice(0, 8) >
      dayShiftLateTime
)
        ? "red"
        : "green",
    fontWeight: "bold",
  }}
>
  {
  item.status
}
</td>
      </tr>
    ))}
  </tbody>
</table>
)}
</>
)}
<div className="bottom-nav">

  <button
    onClick={() =>
      setActiveTab("attendance")
    }
  >
    🏠 {t.attendanceStatus}
  </button>

  <button
    onClick={() =>
      setActiveTab("employees")
    }
  >
    👥 {t.employeeManagement}
  </button>
</div>
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
          check_in: new Date().toLocaleString("sv-SE"),
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
  department,
  shift
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
        check_out: new Date().toLocaleString("sv-SE"),
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
  async function handleUpdateEmployee(
    
  employeeId
) {

  const { error } =
    await supabase
      .from("employees")
      .update({
        department:
          editDepartment,
        shift:
          editShift
      })
      .eq(
        "employee_id",
        employeeId
      );

  if (error) {
    alert("수정 실패");
    return;
  }

  const { data } =
    await supabase
      .from("employees")
      .select("*")
      .eq("active", true);

  setEmployeeList(data || []);

  alert("수정 완료");
}
async function handleRetireEmployee(
  employeeId
) {

  const confirmRetire =
    window.confirm(
      "정말 퇴사 처리하시겠습니까?"
    );

  if (!confirmRetire) return;

  const { error } =
    await supabase
      .from("employees")
      .update({
        active: false
      })
      .eq(
        "employee_id",
        employeeId
      );

  if (error) {
    alert("퇴사 처리 실패");
    return;
  }

  const { data } =
    await supabase
      .from("employees")
      .select("*")
      .eq("active", true);

  setEmployeeList(data || []);

  alert("퇴사 처리 완료");
}

async function handleChangePassword() {

  if (
    newPassword !==
    confirmPassword
  ) {
    alert(
      "새 비밀번호가 일치하지 않습니다."
    );
    return;
  }

  const { data } =
    await supabase
      .from("employees")
      .select("*")
      .eq(
        "employee_id",
        currentEmployeeId
      )
      .single();

  if (
    data.password_hash !==
    currentPassword
  ) {
    alert(
      "현재 비밀번호가 틀렸습니다."
    );
    return;
  }

  const { error } =
    await supabase
      .from("employees")
      .update({
        password_hash:
          newPassword
      })
      .eq(
        "employee_id",
        currentEmployeeId
      );

  if (error) {
    alert(
      "비밀번호 변경 실패"
    );
    return;
  }

  alert(
    "비밀번호 변경 완료"
  );

  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");
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
          shift:
newEmployeeShift,
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
    setNewEmployeeShift("");
  }
}