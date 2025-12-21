# 🧭 Log-Pose-Dashboard


![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=java&logoColor=white)


> **A comprehensive productivity suite running entirely in the browser.** > Includes a fully customizable drag-and-drop **Dashboard** and a powerful, analytics-driven **Habit Tracker**. No backend required—your data lives in your browser.

---

## 📸 Visual Tour

### The Dashboard
| **Your Command Center** | **Deep Customization** |
|:---:|:---:|
| ![Dashboard Overview](imgs/img1.jpg) | ![Settings Panel](imgs/img2.jpg) |
| *A 16x9 grid system with draggable, resizable widgets for notes, finance, and focus.* | *Customize gradients, wallpapers, fonts, and toggle widget visibility.* |

### The HabitMatrix
| **Track Every Detail** | **Visualize Progress** |
|:---:|:---:|
| ![Habit Tracker UI](imgs/img3.jpg) | ![Analytics View](imgs/img4.jpg) |
| *Resizable sidebar, monthly events, and a detailed daily habit grid.* | *Chart.js powered insights, completion rates, and streak tracking.* |

---

## 🌟 Module 1: Interactive Dashboard
The **Dashboard** acts as your browser homepage or "Web OS". It is built on a responsive 16x9 grid system.

### ✨ Key Features
| Feature Block | Description |
| :--- | :--- |
| **🎨 Grid System** | A fully interactive **Draggable & Resizable** grid. Move widgets anywhere, resize them using the bottom-right handle, or lock the grid to prevent changes. |
| **🛠 Widget Suite** | Includes **12+ Native Widgets**: Clock (Flip-style), To-Do List, Notes, Finance Tracker, Bookmarks, Focus Timer (Pomodoro), Calendar, and more. |
| **💾 Data Persistence** | Uses `localStorage` to automatically save your layout, colors, notes, and tasks. Close the browser and everything is there when you return. |
| **🎨 Theme Engine** | Switch between Solid Colors, **Linear Gradients**, or use a custom Image URL/Upload as your background. |
| **📥 JSON Import/Export** | Backup your entire configuration to a `.json` file and restore it on another device instantly. |

---

## 💎 Module 2: HabitMatrix Ultimate
Accessible via the "Habit" widget on the Dashboard, this is a dedicated application for personal growth.

### ✨ Key Features
| Feature Block | Description |
| :--- | :--- |
| **📊 Advanced Analytics** | Integrated **Chart.js** visualizations. View completion rates, daily consistency line charts, and specific habit performance bars. |
| **🌗 UI Flexibility** | Built with **Tailwind CSS**. Features a toggleable **Dark Mode**, resizable sidebar, and adjustable text/column sizing sliders. |
| **📅 Event Integration** | A compact monthly calendar on the sidebar allows you to add specific events or reminders linked to dates alongside your habits. |
| **📝 Daily Journaling** | Each row includes a "Daily Description" field to log your mood or a quick summary of the day. |
| **🧠 Smart Stats** | Automatically calculates your **"Best Habit"**, total completion count, and monthly success percentages. |

---

## 🚀 Installation & Usage

Since this project requires **no backend**, installation is instant.

1.  **Clone the Repository** (or download the ZIP):
    ```bash
    git clone [https://github.com/abhishekdpandey18/Log-Pose-Dashboard](https://github.com/abhishekdpandey18/Log-Pose-Dashboard)
    ```

2.  **File Structure Check**:
    Ensure your folder looks like this for the integration to work:
    ```text
    /Log-Pose-Dashboard/
    |
    ├── .idea/
    │
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── project/
    │       │           └── dashboard/
    │       │               ├── controller/
    │       │               │   └── PageController.java
    │       │               │
    │       │               ├── servlet/
    │       │               │   └── (Servlet classes)
    │       │               │
    │       │               └── DashboardApplication.java
    │       │
    │       └── resources/
    │           ├── static/
    │           │   ├── index.html
    │           │   ├── habit_tracker.html
    │           │   ├── style.css
    │           │   ├── habit_style.css
    │           │   ├── script.js
    │           │   └── habit_script.js
    │           │
    │           └── application.properties
    │
    ├── target/
    │
    ├── pom.xml
    │
    └── README.md
    ```

3.  **Run It**:
    * Simply double-click `index.html` to open it in your browser.
    * **Tip:** Set `index.html` as your browser's "New Tab" page using extensions like "Custom New Tab URL".

---

## 🛠️ Technologies Used

* **Core:** Semantic HTML5, CSS3 (Variables & Grid), Vanilla JavaScript (ES6+).
* **Styling:** Custom CSS (Dashboard) & Tailwind CSS (Habit Tracker).
* **Libraries:** * [Chart.js](https://www.chartjs.org/) (Analytics)
    * [FontAwesome](https://fontawesome.com/) (Icons)
    * [Google Fonts](https://fonts.google.com/) (Inter & Segoe UI)
* **Storage:** Browser `localStorage` API.

---
### 👨‍💻 Contributors

- [**Abhishek Pandey**](https://github.com/abhishekdpandey18) – Project Author & Documentation Writer
- [**Abhyudaya Singh**](https://github.com/abhyudayasingh18) – Logic Developer
- [**Deepanshu**](https://github.com/chikujaurasiya) – java Logic and Servlet

<a href="https://github.com/abhishekdpandey18/Log-Pose-Dashboard/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=abhishekdpandey18/Log-Pose-Dashboard" />
    <img src="https://contrib.rocks/image?repo=abhishekdpandey18/Log-Pose-Dashboard" />
    <img src="https://contrib.rocks/image?repo=abhishekdpandey18/Log-Pose-Dashboard" />
</a>

----

<p align="center">
  Made with ❤️ for productivity enthusiasts.
</p>









