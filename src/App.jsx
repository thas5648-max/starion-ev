import { useState } from "react";
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
  const [newEmployeeId, setNewEmployeeId] = useState("");
const [newEmployeeName, setNewEmployeeName] = useState("");
const [newEmployeePassword, setNewEmployeePassword] = useState("");
const [newEmployeeDepartment, setNewEmployeeDepartment] = useState("");

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

    setUserName(data.name);
setCurrentEmployeeId(data.employee_id);

alert(JSON.stringify(data));

setUserRole(data.role);
    console.log("ROLE =", data.role);

await loadAttendance();

    setLoggedIn(true);
  }

  if (loggedIn) {
    return (
      <div className="container">
        <div className="login-card">
          <h1>{t.welcome}</h1>

          <h2>{userName}</h2>
          <h3>ROLE: {userRole}</h3>

          <button
  className="login-btn"
  onClick={handleCheckIn}
>
  {t.attendance}
</button>
<button
  className="login-btn"
  onClick={handleCheckOut}
>
  퇴근 등록
</button>
{userRole === "admin" && (
     <>
<h3>직원 등록</h3>

<input
  placeholder="사번"
  value={newEmployeeId}
  onChange={(e) => setNewEmployeeId(e.target.value)}
/>

<input
  placeholder="이름"
  value={newEmployeeName}
  onChange={(e) => setNewEmployeeName(e.target.value)}
/>

<input
  placeholder="비밀번호"
  value={newEmployeePassword}
  onChange={(e) => setNewEmployeePassword(e.target.value)}
/>

<input
  placeholder="부서"
  value={newEmployeeDepartment}
  onChange={(e) => setNewEmployeeDepartment(e.target.value)}
/>

<button
  className="login-btn"
  onClick={handleCreateEmployee}
>
  직원 등록
</button>
</>
)}

<h3>오늘 출근자</h3>

<ul>
  {attendanceList.map((item) => (
    <li key={item.id}>
      {item.employee_id}
    </li>
  ))}
</ul>
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

  console.log("출근버튼 클릭");
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
console.log("현재거리(m):", Math.round(distance));

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

  console.log("data:", data);
  console.log("error:", error);

  if (error) {
    alert("출근 등록 실패");
    return;
  }

  await loadAttendance();

  alert("출근 등록 완료");
}

async function loadAttendance() {

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("attendance_date", today);

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

  await loadAttendance();

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