import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  Bot,
  Home,
  User,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  Send,
  Search,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  Mail,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import "./style.css";


const API = import.meta.env.VITE_API_URL;


/* =========================================================
   TEST EMPLOYEES
========================================================= */

const EMPLOYEES = [
  {
    id: 1001,
    name: "Rahul Kumar",
  },
  {
    id: 1002,
    name: "Priya Sharma",
  },
  {
    id: 1003,
    name: "Aman Singh",
  },
  {
    id: 1004,
    name: "Neha Verma",
  },
  {
    id: 1005,
    name: "Rohan Gupta",
  },
];


/* =========================================================
   APP
========================================================= */

function App() {

  const [activePage, setActivePage] = useState("overview");

  // Currently selected employee
  const [employeeId, setEmployeeId] = useState(1001);

  const [employee, setEmployee] = useState(null);

  const [leaveBalance, setLeaveBalance] = useState(null);

  const [leaveHistory, setLeaveHistory] = useState([]);

  const [loading, setLoading] = useState(true);


  /* =======================================================
     LOAD EMPLOYEE DATA
  ======================================================= */

  const loadData = async () => {

    try {

      setLoading(true);

      const [
        employeeRes,
        balanceRes,
        historyRes
      ] = await Promise.all([

        fetch(
          `${API}/employee/${employeeId}`
        ),

        fetch(
          `${API}/leave-balance/${employeeId}`
        ),

        fetch(
          `${API}/leave-history/${employeeId}`
        ),

      ]);


      if (!employeeRes.ok) {
        throw new Error(
          `Employee API error: ${employeeRes.status}`
        );
      }


      const employeeData =
        await employeeRes.json();


      const balanceData =
        await balanceRes.json();


      const historyData =
        await historyRes.json();


      console.log(
        "Selected employee:",
        employeeId
      );

      console.log(
        "Employee data:",
        employeeData
      );

      console.log(
        "Leave balance:",
        balanceData
      );

      console.log(
        "Leave history:",
        historyData
      );


      setEmployee(employeeData);

      setLeaveBalance(balanceData);


      if (Array.isArray(historyData)) {

        setLeaveHistory(historyData);

      } else {

        setLeaveHistory(
          historyData?.requests ||
          historyData?.leave_requests ||
          []
        );

      }

    } catch (error) {

      console.error(
        "Failed to load HR data:",
        error
      );

      setEmployee(null);

      setLeaveBalance(null);

      setLeaveHistory([]);

    } finally {

      setLoading(false);

    }

  };


  /* =======================================================
     RELOAD WHEN EMPLOYEE CHANGES
  ======================================================= */

  useEffect(() => {

    loadData();

  }, [employeeId]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = (page) => {

    setActivePage(page);

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="app-shell">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">


        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">

            <Bot size={25} />

          </div>


          <div>

            <h2>HRMate AI</h2>

            <span>
              Employee Operations
            </span>

          </div>

        </div>


        {/* NAVIGATION */}

        <div className="sidebar-section">

          <p className="sidebar-label">
            WORKSPACE
          </p>


          <NavItem
            icon={<Home size={19} />}
            label="Overview"
            active={
              activePage === "overview"
            }
            onClick={() =>
              navigate("overview")
            }
          />


          <NavItem
            icon={<User size={19} />}
            label="My profile"
            active={
              activePage === "profile"
            }
            onClick={() =>
              navigate("profile")
            }
          />


          <NavItem
            icon={<CalendarDays size={19} />}
            label="Leave requests"
            active={
              activePage === "leave"
            }
            onClick={() =>
              navigate("leave")
            }
          />


          <NavItem
            icon={<FileText size={19} />}
            label="HR policies"
            active={
              activePage === "policies"
            }
            onClick={() =>
              navigate("policies")
            }
          />

        </div>


        {/* BOTTOM */}

        <div className="sidebar-bottom">


          <div className="secure-card">

            <ShieldCheck size={20} />

            <div>

              <strong>
                Secure workspace
              </strong>

              <span>
                Your HR data stays protected.
              </span>

            </div>

          </div>


          <NavItem
            icon={<Settings size={19} />}
            label="Settings"
            active={false}
            onClick={() => {}}
          />


          <NavItem
            icon={<LogOut size={19} />}
            label="Sign out"
            active={false}
            onClick={() =>
              alert(
                "Demo application"
              )
            }
          />

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">


        {/* TOP BAR */}

        <header className="topbar">


          <div className="breadcrumb">

            Workspace

            <span>/</span>

            <strong>

              {activePage === "overview" &&
                "Overview"}

              {activePage === "profile" &&
                "My profile"}

              {activePage === "leave" &&
                "Leave requests"}

              {activePage === "policies" &&
                "HR policies"}

            </strong>

          </div>


          <div className="top-actions">


            {/* EMPLOYEE SELECTOR */}

            <div className="employee-selector-top">

              <span>
                Employee:
              </span>


              <select
                value={employeeId}
                onChange={(e) =>
                  setEmployeeId(
                    Number(e.target.value)
                  )
                }
              >

                {EMPLOYEES.map(
                  (emp) => (

                    <option
                      key={emp.id}
                      value={emp.id}
                    >
                      {emp.name} — {emp.id}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* SEARCH */}

            <div className="search-box">

              <Search size={17} />

              <input
                placeholder="Search..."
              />

            </div>


            {/* AVATAR */}

            <button className="avatar">

              {employee?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </button>

          </div>

        </header>


        {/* CONTENT */}

        <div className="content">


          {loading ? (

            <Loading />

          ) : (

            <>


              {/* OVERVIEW */}

              {activePage === "overview" && (

                <Overview
                  employee={employee}
                  employeeId={employeeId}
                  leaveBalance={leaveBalance}
                  leaveHistory={leaveHistory}
                  navigate={navigate}
                  refresh={loadData}
                />

              )}


              {/* PROFILE */}

              {activePage === "profile" && (

                <Profile
                  employee={employee}
                />

              )}


              {/* LEAVE */}

              {activePage === "leave" && (

                <LeaveRequests
                  leaveHistory={leaveHistory}
                  refresh={loadData}
                />

              )}


              {/* POLICIES */}

              {activePage === "policies" && (

                <Policies
                  navigate={navigate}
                />

              )}

            </>

          )}

        </div>

      </main>

    </div>

  );

}


/* =========================================================
   NAV ITEM
========================================================= */

function NavItem({
  icon,
  label,
  active,
  onClick
}) {

  return (

    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      {icon}

      <span>
        {label}
      </span>

    </button>

  );

}


/* =========================================================
   OVERVIEW
========================================================= */

function Overview({
  employee,
  employeeId,
  leaveBalance,
  leaveHistory,
  navigate,
  refresh
}) {


  /*
    Your database stores:

    employee_id
    leave_type
    balance

    Example:

    1001 | casual | 8
    1001 | sick   | 6
  */


  const casual =
    getLeaveBalance(
      leaveBalance,
      "casual"
    );


  const sick =
    getLeaveBalance(
      leaveBalance,
      "sick"
    );


  const pending =
    leaveHistory.filter(
      (item) =>
        String(
          item.status || ""
        ).toUpperCase() === "PENDING"
    ).length;


  return (

    <>


      {/* WELCOME */}

      <section className="welcome-row">


        <div>

          <div className="eyebrow">

            <Sparkles size={15} />

            AI-powered HR workspace

          </div>


          <h1>

            Welcome back,{" "}

            {employee?.name ||
              "Employee"}

          </h1>


          <p>

            Manage employee operations
            and get HR answers with
            HRMate AI.

          </p>

        </div>


        <div className="agent-status">

          <span className="online-dot"></span>

          Agent online

        </div>

      </section>


      {/* EMPLOYEE INFO */}

      <div className="selected-employee-banner">

        <div>

          <span>
            Currently viewing
          </span>

          <strong>
            {employee?.name ||
              "Employee"}
          </strong>

        </div>

        <small>
          Employee ID: {employeeId}
        </small>

      </div>


      {/* STATS */}

      <section className="stats-grid">


        <StatCard
          icon={
            <CalendarDays />
          }
          title="Casual leave"
          value={casual}
          subtitle="days remaining"
        />


        <StatCard
          icon={<Clock3 />}
          title="Sick leave"
          value={sick}
          subtitle="days remaining"
        />


        <StatCard
          icon={
            <AlertCircle />
          }
          title="Pending requests"
          value={pending}
          subtitle="awaiting approval"
        />


        <StatCard
          icon={
            <CheckCircle2 />
          }
          title="Total requests"
          value={
            leaveHistory.length
          }
          subtitle="leave history"
        />

      </section>


      {/* MAIN GRID */}

      <section className="dashboard-grid">


        {/* AI CHAT */}

        <ChatBox
          employeeId={employeeId}
        />


        {/* RIGHT SIDE */}

        <div className="side-column">


          {/* QUICK ACTIONS */}

          <div className="panel">


            <div className="panel-header">

              <div>

                <h3>
                  Quick actions
                </h3>

                <p>
                  Common HR tasks
                </p>

              </div>

            </div>


            <QuickAction
              icon={
                <CalendarDays />
              }
              title="Leave requests"
              text="View your leave history"
              onClick={() =>
                navigate("leave")
              }
            />


            <QuickAction
              icon={
                <FileText />
              }
              title="HR policies"
              text="Explore company policies"
              onClick={() =>
                navigate("policies")
              }
            />


            <QuickAction
              icon={<User />}
              title="My profile"
              text="View employee information"
              onClick={() =>
                navigate("profile")
              }
            />

          </div>


          {/* WORKFLOW */}

          <div className="panel workflow-panel">


            <div className="panel-header">

              <div>

                <h3>
                  Agent workflow
                </h3>

                <p>
                  How HRMate handles requests
                </p>

              </div>

            </div>


            <WorkflowStep
              number="01"
              title="Understand"
              text="Reads your request"
            />


            <WorkflowStep
              number="02"
              title="Find data"
              text="Uses the right HR tool"
            />


            <WorkflowStep
              number="03"
              title="Take action"
              text="Executes approved workflows"
            />

          </div>

        </div>

      </section>


      {/* REFRESH */}

      <div className="refresh-row">

        <button
          className="secondary-button"
          onClick={refresh}
        >

          <RefreshCw size={16} />

          Refresh HR data

        </button>

      </div>

    </>

  );

}


/* =========================================================
   LEAVE BALANCE HELPER
========================================================= */

function getLeaveBalance(
  data,
  type
) {

  if (!data) {
    return 0;
  }


  /*
    Case 1:

    API returns:

    {
      "casual": 8,
      "sick": 6
    }
  */

  if (
    typeof data === "object" &&
    !Array.isArray(data)
  ) {

    const directValue =
      data[type];

    if (
      directValue !== undefined &&
      directValue !== null
    ) {

      return Number(
        directValue
      ) || 0;

    }


    const directValue2 =
      data[`${type}_leave`];

    if (
      directValue2 !== undefined &&
      directValue2 !== null
    ) {

      return Number(
        directValue2
      ) || 0;

    }

  }


  /*
    Case 2:

    API returns:

    [
      {
        leave_type: "casual",
        balance: 8
      },
      {
        leave_type: "sick",
        balance: 6
      }
    ]
  */

  if (Array.isArray(data)) {

    const item =
      data.find(
        (row) =>
          String(
            row.leave_type || ""
          ).toLowerCase() ===
          type.toLowerCase()
      );


    if (item) {

      return Number(
        item.balance
      ) || 0;

    }

  }


  /*
    Case 3:

    API returns:

    {
      balances: [
        ...
      ]
    }
  */

  if (
    Array.isArray(
      data.balances
    )
  ) {

    const item =
      data.balances.find(
        (row) =>
          String(
            row.leave_type || ""
          ).toLowerCase() ===
          type.toLowerCase()
      );


    if (item) {

      return Number(
        item.balance
      ) || 0;

    }

  }


  return 0;

}


/* =========================================================
   PROFILE
========================================================= */

function Profile({
  employee
}) {

  return (

    <>


      <PageHeading
        eyebrow="EMPLOYEE"
        title="My profile"
        subtitle="Your employee information stored in HRMate."
      />


      <div className="profile-layout">


        {/* PROFILE CARD */}

        <div className="profile-card">


          <div className="profile-avatar-large">

            {employee?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          <h2>

            {employee?.name ||
              "Employee"}

          </h2>


          <p className="profile-role">

            {employee?.department ||
              "Department"}{" "}

            Department

          </p>


          <div className="status-pill">

            <span></span>

            Active employee

          </div>

        </div>


        {/* DETAILS */}

        <div className="panel details-panel">


          <div className="panel-header">

            <div>

              <h3>
                Employee information
              </h3>

              <p>
                Information retrieved from
                the HR database.
              </p>

            </div>

          </div>


          <InfoRow
            icon={<User />}
            label="Employee ID"
            value={
              employee?.id
            }
          />


          <InfoRow
            icon={<User />}
            label="Name"
            value={
              employee?.name
            }
          />


          <InfoRow
            icon={<Mail />}
            label="Email"
            value={
              employee?.email
            }
          />


          <InfoRow
            icon={<Building2 />}
            label="Department"
            value={
              employee?.department
            }
          />

        </div>

      </div>

    </>

  );

}


/* =========================================================
   LEAVE REQUESTS
========================================================= */

function LeaveRequests({
  leaveHistory,
  refresh
}) {

  return (

    <>


      <PageHeading
        eyebrow="TIME OFF"
        title="Leave requests"
        subtitle="Track submitted leave requests and approval status."
      />


      <div className="panel">


        <div className="panel-header">


          <div>

            <h3>
              Request history
            </h3>

            <p>

              {leaveHistory.length}

              {" "}

              request
              {
                leaveHistory.length !== 1
                  ? "s"
                  : ""
              }

              {" "}found

            </p>

          </div>


          <button
            className="secondary-button"
            onClick={refresh}
          >

            <RefreshCw size={16} />

            Refresh

          </button>

        </div>


        {leaveHistory.length === 0 ? (

          <div className="empty-state">

            <CalendarDays size={36} />

            <h3>
              No leave requests
            </h3>

            <p>
              No leave requests have
              been submitted for this
              employee yet.
            </p>

          </div>

        ) : (

          <div className="table-wrapper">

            <table>


              <thead>

                <tr>

                  <th>
                    Dates
                  </th>

                  <th>
                    Days
                  </th>

                  <th>
                    Reason
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {leaveHistory.map(
                  (request, index) => {

                    const status =
                      String(
                        request.status ||
                        "PENDING"
                      ).toUpperCase();


                    return (

                      <tr
                        key={
                          request.id ||
                          index
                        }
                      >


                        <td>

                          <strong>

                            {request.start_date ||
                              request.start ||
                              request.from ||
                              "-"}

                          </strong>


                          <span className="date-arrow">
                            {" "}→{" "}
                          </span>


                          <strong>

                            {request.end_date ||
                              request.end ||
                              request.to ||
                              "-"}

                          </strong>

                        </td>


                        <td>

                          {request.days ||
                            request.total_days ||
                            request.duration ||
                            calculateDays(
                              request.start_date,
                              request.end_date
                            ) ||
                            "-"}

                        </td>


                        <td>

                          {request.reason ||
                            "Leave request"}

                        </td>


                        <td>

                          <StatusBadge
                            status={status}
                          />

                        </td>

                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </>

  );

}


/* =========================================================
   CALCULATE DAYS
========================================================= */

function calculateDays(
  start,
  end
) {

  if (!start || !end) {
    return null;
  }


  const startDate =
    new Date(start);

  const endDate =
    new Date(end);


  if (
    Number.isNaN(
      startDate.getTime()
    ) ||
    Number.isNaN(
      endDate.getTime()
    )
  ) {

    return null;

  }


  const difference =
    endDate.getTime() -
    startDate.getTime();


  return (
    Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    ) + 1
  );

}


/* =========================================================
   HR POLICIES
========================================================= */

function Policies({
  navigate
}) {

  const askPolicy = (
    question
  ) => {

    navigate("overview");


    setTimeout(() => {

      window.dispatchEvent(
        new CustomEvent(
          "hrmate-question",
          {
            detail: question
          }
        )
      );

    }, 150);

  };


  const policies = [

    {
      title:
        "Work From Home",

      description:
        "Understand the rules and approval process for working remotely.",

      question:
        "What is the WFH policy?"
    },


    {
      title:
        "Leave Policy",

      description:
        "Ask HRMate about leave rules, balances and approval.",

      question:
        "What is the leave policy?"
    },


    {
      title:
        "Employee Support",

      description:
        "Ask HRMate AI about employee operations and HR processes.",

      question:
        "What HR support can HRMate provide?"
    }

  ];


  return (

    <>


      <PageHeading
        eyebrow="KNOWLEDGE BASE"
        title="HR policies"
        subtitle="Ask HRMate AI questions about company policies."
      />


      <div className="policy-grid">


        {policies.map(
          (policy) => (

            <div
              className="policy-card"
              key={policy.title}
            >


              <div className="policy-icon">

                <FileText size={22} />

              </div>


              <h3>
                {policy.title}
              </h3>


              <p>
                {policy.description}
              </p>


              <button
                className="policy-button"
                onClick={() =>
                  askPolicy(
                    policy.question
                  )
                }
              >

                Ask HRMate

                <ArrowRight
                  size={16}
                />

              </button>

            </div>

          )
        )}

      </div>


      <div className="policy-tip">


        <div className="tip-icon">

          <Bot size={22} />

        </div>


        <div>

          <strong>
            AI-powered policy search
          </strong>


          <p>

            HRMate uses the HR policy
            knowledge base to retrieve
            relevant information before
            answering your question.

          </p>

        </div>

      </div>

    </>

  );

}


/* =========================================================
   CHAT BOX
========================================================= */

function ChatBox({
  employeeId,
}) {


  const [
    messages,
    setMessages
  ] = useState([

    {
      role: "assistant",

      content:
        "Hi! I'm HRMate AI. Ask me about your employee information, leave balance, leave requests or HR policies."
    }

  ]);


  const [
    input,
    setInput
  ] = useState("");


  const [
    sending,
    setSending
  ] = useState(false);


  /* =======================================================
     RECEIVE POLICY QUESTIONS
  ======================================================= */

  useEffect(() => {

    const handler = (
      event
    ) => {

      sendMessage(
        event.detail
      );

    };


    window.addEventListener(
      "hrmate-question",
      handler
    );


    return () => {

      window.removeEventListener(
        "hrmate-question",
        handler
      );

    };

  }, []);


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = async (
    forcedText
  ) => {

    const text =
      String(
        forcedText ?? input
      ).trim();


    if (
      !text ||
      sending
    ) {

      return;

    }


    setInput("");


    setMessages(
      (previous) => [

        ...previous,

        {
          role: "user",
          content: text
        }

      ]
    );


    setSending(true);


    try {


      const response =
        await fetch(
          `${API}/chat`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              employee_id:
                employeeId,

              message:
                text

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.detail ||
          "Chat request failed"
        );

      }


      const answer =
        data.response ||
        data.answer ||
        data.message ||
        "I couldn't process that request.";


      setMessages(
        (previous) => [

          ...previous,

          {
            role: "assistant",
            content: answer
          }

        ]
      );


      /*
        If the AI created a leave request,
        reload the dashboard so the
        leave count/history updates.
      */

       {

        setTimeout(() => {

          onLeaveCreated?.();

        }, 500);

      }


    } catch (error) {

      console.error(
        "Chat error:",
        error
      );


      setMessages(
        (previous) => [

          ...previous,

          {
            role: "assistant",

            content:
              "Sorry, I couldn't connect to the HRMate backend. Please make sure FastAPI is running on port 8000."
          }

        ]
      );

    } finally {

      setSending(false);

    }

  };


  const quickQuestions = [

    "Show my employee information",

    "How many casual leaves do I have?",

    "What is the WFH policy?"

  ];


  return (

    <div className="panel chat-panel">


      {/* CHAT HEADER */}

      <div className="panel-header chat-header">


        <div className="assistant-title">


          <div className="assistant-icon">

            <Bot size={21} />

          </div>


          <div>

            <h3>
              HRMate Assistant
            </h3>


            <p>

              <span className="online-dot small"></span>

              AI agent online

            </p>

          </div>

        </div>


      </div>


      {/* MESSAGES */}

      <div className="chat-messages">


        {messages.map(
          (message, index) => (

            <div
              className={`message-row ${
                message.role
              }`}
              key={index}
            >


              {message.role ===
                "assistant" && (

                <div className="message-avatar">

                  <Bot size={15} />

                </div>

              )}


              <div className="message-bubble">

                {formatMessage(
                  message.content
                )}

              </div>

            </div>

          )
        )}


        {sending && (

          <div className="message-row assistant">


            <div className="message-avatar">

              <Bot size={15} />

            </div>


            <div className="message-bubble typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>


      {/* QUICK QUESTIONS */}

      <div className="quick-questions">


        {quickQuestions.map(
          (question) => (

            <button
              key={question}
              onClick={() =>
                sendMessage(
                  question
                )
              }
            >

              {question}

            </button>

          )
        )}

      </div>


      {/* INPUT */}

      <div className="chat-input">


        <input

          value={input}

          onChange={(e) =>
            setInput(
              e.target.value
            )
          }

          onKeyDown={(e) => {

            if (
              e.key === "Enter"
            ) {

              sendMessage();

            }

          }}

          placeholder="Ask HRMate anything..."

        />


        <button
          onClick={() =>
            sendMessage()
          }
          disabled={sending}
        >

          <Send size={18} />

        </button>

      </div>

    </div>

  );

}


/* =========================================================
   MARKDOWN FORMATTER
========================================================= */

function formatMessage(
  text
) {

  const value =
    String(text || "");


  const parts =
    value.split(
      /(\*\*.*?\*\*)/g
    );


  return parts.map(
    (part, index) => {

      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {

        return (

          <strong
            key={index}
          >

            {part.slice(
              2,
              -2
            )}

          </strong>

        );

      }


      return (

        <React.Fragment
          key={index}
        >

          {part}

        </React.Fragment>

      );

    }
  );

}


/* =========================================================
   PAGE HEADING
========================================================= */

function PageHeading({
  eyebrow,
  title,
  subtitle
}) {

  return (

    <div className="page-heading">


      <div className="eyebrow">

        <Sparkles size={15} />

        {eyebrow}

      </div>


      <h1>
        {title}
      </h1>


      <p>
        {subtitle}
      </p>

    </div>

  );

}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  subtitle
}) {

  return (

    <div className="stat-card">


      <div className="stat-icon">

        {icon}

      </div>


      <div>

        <span>
          {title}
        </span>


        <strong>
          {value}
        </strong>


        <small>
          {subtitle}
        </small>

      </div>

    </div>

  );

}


/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  text,
  onClick
}) {

  return (

    <button
      className="quick-action"
      onClick={onClick}
    >


      <div className="quick-action-icon">

        {icon}

      </div>


      <div>

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>


      <ArrowRight
        size={17}
      />

    </button>

  );

}


/* =========================================================
   WORKFLOW STEP
========================================================= */

function WorkflowStep({
  number,
  title,
  text
}) {

  return (

    <div className="workflow-step">


      <span className="step-number">

        {number}

      </span>


      <div>

        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>

  );

}


/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  value
}) {

  return (

    <div className="info-row">


      <div className="info-icon">

        {icon}

      </div>


      <div>

        <span>
          {label}
        </span>


        <strong>
          {value ||
            "Not available"}
        </strong>

      </div>

    </div>

  );

}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status
}) {

  const normalized =
    String(status)
      .toLowerCase();


  return (

    <span
      className={`status-badge ${
        normalized
      }`}
    >


      {normalized ===
        "approved" && (

        <CheckCircle2
          size={14}
        />

      )}


      {normalized ===
        "pending" && (

        <Clock3
          size={14}
        />

      )}


      {normalized ===
        "rejected" && (

        <AlertCircle
          size={14}
        />

      )}


      {status}

    </span>

  );

}


/* =========================================================
   LOADING
========================================================= */

function Loading() {

  return (

    <div className="loading-screen">


      <div className="loading-icon">

        <Bot size={28} />

      </div>


      <h2>
        Loading HRMate...
      </h2>


      <p>
        Connecting to your HR workspace.
      </p>

    </div>

  );

}


/* =========================================================
   START REACT
========================================================= */

createRoot(
  document.getElementById(
    "root"
  )
).render(

  <React.StrictMode>

    <App />

  </React.StrictMode>

);