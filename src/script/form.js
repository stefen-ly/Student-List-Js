AOS.init({ duration: 600, once: true, offset: 100 });

      let students = JSON.parse(localStorage.getItem("students")) || [];
      let nextId = parseInt(localStorage.getItem("nextId")) || 1;
      let editingStudentId = null;

      function generateId() {
        return "ST-" + String(nextId).padStart(4, "0");
      }

      function saveToLocalStorage() {
        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("nextId", nextId);
      }

      function updateTotalStudents() {
        document.getElementById("totalStudents").textContent = students.length;
      }

      function showNotification(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `p-3 rounded-lg shadow-lg text-white font-medium transition-opacity duration-300 ${
          type === "success" ? "bg-teal-600" : "bg-rose-500"
        } text-sm`;
        toast.setAttribute("data-aos", "fade-left");
        toast.setAttribute("data-aos-duration", "400");
        toast.textContent = message;
        toast.setAttribute("role", "alert");
        const container = document.getElementById("toast-container");
        container.appendChild(toast);
        AOS.refresh();
        setTimeout(() => {
          toast.classList.add("opacity-0");
          setTimeout(() => toast.remove(), 300);
        }, 3000);
      }

      function resetForm() {
        document.getElementById("name").value = "";
        document.getElementById("grade").selectedIndex = 0;
        document.getElementById("formTitle").innerHTML = `
        <svg
          class="w-6 h-6 text-white inline mr-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
            clip-rule="evenodd"
          />
        </svg>
        Add New Student
      `;

        document.getElementById("submitButton").textContent = "Add Student";
        document
          .getElementById("submitButton")
          .classList.remove("bg-amber-500", "hover:bg-amber-600");
        document
          .getElementById("submitButton")
          .classList.add("bg-indigo-600", "hover:bg-indigo-700");
        document.getElementById("cancelButton").classList.add("hidden");
        editingStudentId = null;
      }

      function addOrUpdateStudent() {
        const name = document.getElementById("name").value.trim();
        const grade = document.getElementById("grade").value;
        if (!name || !grade)
          return showNotification(
            "Please fill out both name and grade.",
            "error"
          );
        if (name.length < 2)
          return showNotification(
            "Name must be at least 2 characters.",
            "error"
          );

        if (editingStudentId) {
          const student = students.find((s) => s.id === editingStudentId);
          if (student) {
            student.name = name;
            student.grade = grade;
            showNotification("Student updated successfully!");
          }
        } else {
          const id = generateId();
          students.push({ id, name, grade });
          nextId++;
          showNotification("Student added successfully!");
        }

        saveToLocalStorage();
        resetForm();
        filterAndSort();
        updateTotalStudents();
      }

      function editStudent(id) {
        const student = students.find((s) => s.id === id);
        if (student) {
          document.getElementById("name").value = student.name;
          document.getElementById("grade").value = student.grade;
          document.getElementById("formTitle").innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 inline-block mr-2 text-white" viewBox="0 0 640 512">
            <path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h274.9c-2.4-6.8-3.4-14-2.6-21.3l6.8-60.9l1.2-11.1l7.9-7.9l77.3-77.3c-24.5-27.7-60-45.5-99.9-45.5zm45.3 145.3l-6.8 61c-1.1 10.2 7.5 18.8 17.6 17.6l60.9-6.8l137.9-137.9l-71.7-71.7l-137.9 137.8zM633 268.9L595.1 231c-9.3-9.3-24.5-9.3-33.8 0l-37.8 37.8l-4.1 4.1l71.8 71.7l41.8-41.8c9.3-9.4 9.3-24.5 0-33.9z"/>
          </svg>
          Edit Student
        `;

          document.getElementById("submitButton").textContent =
            "Update Student";
          document
            .getElementById("submitButton")
            .classList.remove("bg-indigo-600", "hover:bg-indigo-700");
          document
            .getElementById("submitButton")
            .classList.add("bg-amber-500", "hover:bg-amber-600");
          document.getElementById("cancelButton").classList.remove("hidden");
          editingStudentId = id;
        }
      }

      function deleteStudent(id) {
        students = students.filter((s) => s.id !== id);
        saveToLocalStorage();
        filterAndSort();
        updateTotalStudents();
        showNotification("Student deleted successfully.");
      }

      function displayStudents(list = students) {
        const container = document.getElementById("studentCards");
        container.innerHTML = "";
        if (list.length === 0) {
          container.innerHTML = `<p class="text-gray-500 col-span-full text-center text-sm">No students found.</p>`;
          return;
        }
        list.forEach((s, index) => {
          const card = document.createElement("div");
          card.className =
            "bg-white/30 backdrop-blur-md border border-white/40 rounded-lg p-4 shadow-md";
          card.setAttribute("data-aos", "fade-up");
          card.setAttribute("data-aos-duration", "600");
          card.setAttribute("data-aos-delay", index * 100);
          card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-base font-bold text-gray-800">ID: ${s.id}</h3>
              <div class="space-x-2">
                <button onclick="editStudent('${s.id}')" class="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">Edit</button>
                <button onclick="deleteStudent('${s.id}')" class="text-sm text-rose-500 hover:text-rose-600 font-semibold">Delete</button>
              </div>
            </div>
            <p class="text-gray-600 text-sm"><span class="font-semibold">Name:</span> ${s.name}</p>
            <p class="text-gray-600 text-sm"><span class="font-semibold">Grade:</span> ${s.grade}</p>
          `;
          container.appendChild(card);
        });
        AOS.refresh();
      }

      function filterAndSort() {
        const grade = document.getElementById("filterGrade").value;
        const sortOrder = document.getElementById("sortOrder").value;
        const search = document
          .getElementById("searchName")
          .value.toLowerCase();

        let filtered = [...students];
        if (grade && grade !== "all")
          filtered = filtered.filter((s) => s.grade === grade);
        if (search)
          filtered = filtered.filter((s) =>
            s.name.toLowerCase().includes(search)
          );

        if (sortOrder === "name-asc")
          filtered.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortOrder === "name-desc")
          filtered.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortOrder === "grade-asc")
          filtered.sort((a, b) => a.grade.localeCompare(b.grade));
        else if (sortOrder === "grade-desc")
          filtered.sort((a, b) => b.grade.localeCompare(a.grade));

        displayStudents(filtered);
      }

      function resetFilters() {
        document.getElementById("filterGrade").selectedIndex = 0;
        document.getElementById("sortOrder").selectedIndex = 0;
        document.getElementById("searchName").value = "";
        displayStudents();
      }

      function exportCSV() {
        const csv = ["ID,Name,Grade"];
        students.forEach((s) => csv.push(`${s.id},${s.name},${s.grade}`));
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "students.csv";
        a.click();
        URL.revokeObjectURL(url);
      }

      function clearAll() {
        if (confirm("Are you sure you want to delete all students?")) {
          students = [];
          nextId = 1;
          saveToLocalStorage();
          displayStudents();
          updateTotalStudents();
          showNotification("All students cleared.", "error");
        }
      }

      
      updateTotalStudents();
      displayStudents();