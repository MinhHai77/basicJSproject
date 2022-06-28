/**
 * STUDENT - CRUD(create-read-update-delete)
 * 1. break down requirements
 *     + Thêm sinh viên
 *     + Show danh sách sinh viên
 *     + Xoá sinh viên
 *     + cập nhật sinh viên
 *     + tìm kiếm sinh viên theo tên + mã
 *     + validate dữ liệu
 * 2. lên giao diện (mock up)
 * 3. Phân lớp đối tượng
 *
 */

var studentList = [];

// expression function
var createStudent = function () {
  var isFormValid = validate();

  if (!isFormValid) return;

  // 1.DOM lấy ra value từ input
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;

  // 2. new Student()
  var newStudent = new Student(
    name,
    id,
    email,
    dob,
    course,
    math,
    physic,
    chemistry
  );

  // 3. push vào studentList
  studentList.push(newStudent);

  // 4. in table
  renderStudents();

  // 5. luư vào localstorage
  saveData();
};

var deleteStudent = function (id) {
  var index = findById(id);
  if (index === -1) {
    alert("Sinh viên không tồn tại!");
    return;
  }
  studentList.splice(index, 1);
  renderStudents();
  saveData();
};

// update 1: lấy thông tin student đưa lên form
var getStudent = function (id) {
  var index = findById(id);

  if (index === -1) {
    alert("Sinh viên không tồn tại!");
    return;
  }

  var foundStudent = studentList[index];

  document.getElementById("txtMaSV").value = foundStudent.id;
  document.getElementById("txtTenSV").value = foundStudent.name;
  document.getElementById("txtEmail").value = foundStudent.email;
  document.getElementById("txtNgaySinh").value = foundStudent.dob;
  document.getElementById("khSV").value = foundStudent.course;
  document.getElementById("txtDiemToan").value = foundStudent.math;
  document.getElementById("txtDiemLy").value = foundStudent.physic;
  document.getElementById("txtDiemHoa").value = foundStudent.chemistry;

  document.getElementById("btnCreate").style.display = "none";
  document.getElementById("btnUpdate").style.display = "inline-block";

  document.getElementById("txtMaSV").disabled = true;
};

// update 2: lưu thay đổi

var updateStudent = function () {
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;
  var email = document.getElementById("txtEmail").value;
  var dob = document.getElementById("txtNgaySinh").value;
  var course = document.getElementById("khSV").value;
  var math = +document.getElementById("txtDiemToan").value;
  var physic = +document.getElementById("txtDiemLy").value;
  var chemistry = +document.getElementById("txtDiemHoa").value;

  var index = findById(id);

  if (index === -1) {
    alert("Sinh viên không tồn tại!");
    return;
  }

  var foundStudent = studentList[index];

  foundStudent.name = name;
  foundStudent.email = email;
  foundStudent.dob = dob;
  foundStudent.course = course;
  foundStudent.math = math;
  foundStudent.physic = physic;
  foundStudent.chemistry = chemistry;

  renderStudents();
  saveData();

  document.getElementById("btnReset").click();

  document.getElementById("btnCreate").style.display = "block";
  document.getElementById("btnUpdate").style.display = "none";
  document.getElementById("txtMaSV").disabled = false;
};

var renderStudents = function (data) {
  data = data || studentList;

  var dataHTML = "";
  for (var i = 0; i < data.length; i++) {
    dataHTML += `<tr>
      <td>${i + 1}</td>
      <td>${data[i].id}</td>
      <td>${data[i].name}</td>
      <td>${data[i].email}</td>
      <td>${data[i].dob}</td>
      <td>${data[i].course}</td>
      <td>${data[i].calcGPA()}</td>
      <td>
        <button class="btn btn-danger" onclick="deleteStudent('${
          data[i].id
        }')" >Delete</button>
        <button class="btn btn-info" onclick="getStudent('${
          data[i].id
        }')">Upload</button>
      </td>
    </tr>`;
  }
  document.getElementById("tbodySinhVien").innerHTML = dataHTML;
};

var findStudent = function () {
  var keyword = document.getElementById("txtSearch").value.toLowerCase().trim();
  var results = [];

  for (var i = 0; i < studentList.length; i++) {
    var studentName = studentList[i].name.toLowerCase();
    if (studentList[i].id === keyword || studentName.includes(keyword)) {
      results.push(studentList[i]);
    }
  }

  renderStudents(results);
};

var findById = function (id) {
  for (var i = 0; i < studentList.length; i++) {
    if (studentList[i].id === id) {
      return i;
    }
  }
  return -1;
};

var saveData = function () {
  var studentListJSON = JSON.stringify(studentList);
  localStorage.setItem("list", studentListJSON);
};

var getData = function () {
  var studentListJSON = localStorage.getItem("list");
  if (studentListJSON) {
    studentList = mapData(JSON.parse(studentListJSON));
    renderStudents();
  }
};

var mapData = function (dataFromLocal) {
  var data = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var currentStudent = dataFromLocal[i];
    var mappedStudent = new Student(
      currentStudent.name,
      currentStudent.id,
      currentStudent.email,
      currentStudent.dob,
      currentStudent.course,
      currentStudent.math,
      currentStudent.physic,
      currentStudent.chemistry
    );

    data.push(mappedStudent);
  }

  return data;
};

getData();



// ----------VALIDATION-----------------

var validate = function () {
  var id = document.getElementById("txtMaSV").value;
  var name = document.getElementById("txtTenSV").value;

  // var textPattern = /^([A-z\s]*)$/g;
  var textPattern = /^[A-z ]+$/g;
  // var numberPattern = /^[0-9]+$/g;

  var isValid = true;

  isValid &= require(id, "spanMaSV") && length(id, "spanMaSV", 5, 10);
  isValid &=
    require(name, "spanTenSV") && pattern(name, "spanTenSV", textPattern);

  return isValid;
};

// Required
var require = function (val, spanId, message) {
  if (!val) {
    document.getElementById(spanId).innerHTML =
      message || "* Trường này bắt buộc nhập";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};

// Length
var length = function (val, spanId, min, max) {
  if (val.length < min || val.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `* Độ dài phải từ ${min} tới ${max} kí tự.`;
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};

// Pattern
var pattern = function (val, spanId, regex) {
  var valid = regex.test(val);

  if (!valid) {
    document.getElementById(spanId).innerHTML = "* Không đúng định dạng";
    return false;
  }
  document.getElementById(spanId).innerHTML = "";
  return true;
};


