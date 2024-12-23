"use client";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
        background: "#111827",
        color: "#fff",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "40px", fontSize: "2.5rem", fontWeight: "700" }}>
        Communication Portal
      </h1>
      <div
        style={{
          display: "flex",
          gap: "30px",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Group Chat Card */}
        <div
          onClick={() => router.push("/student/communication/group")}
          style={{
            width: "280px",
            height: "180px",
            background: "#4B5563",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "15px",
            cursor: "pointer",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.4s, box-shadow 0.4s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0px 10px 25px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0px 6px 15px rgba(0, 0, 0, 0.3)";
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", fontWeight: "600" }}>
            Group Chat
          </h2>
          <p style={{ fontSize: "1rem", opacity: "0.9" }}>
            Collaborate with your groups effortlessly.
          </p>
        </div>

        {/* Private Chat Card */}
        <div
          onClick={() => router.push("/student/communication/privateChat")}
          style={{
            width: "280px",
            height: "180px",
            background: "#6B7280",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "15px",
            cursor: "pointer",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.4s, box-shadow 0.4s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0px 10px 25px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0px 6px 15px rgba(0, 0, 0, 0.3)";
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", fontWeight: "600" }}>
            Private Chat
          </h2>
          <p style={{ fontSize: "1rem", opacity: "0.9" }}>
            Connect one-on-one seamlessly.
          </p>
        </div>

        {/* Forums Card */}
        <div
          onClick={() => router.push("forums")}
          style={{
            width: "280px",
            height: "180px",
            background: "#4B5563",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "15px",
            cursor: "pointer",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.4s, box-shadow 0.4s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow =
              "0px 10px 25px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0px 6px 15px rgba(0, 0, 0, 0.3)";
          }}
        >
          <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", fontWeight: "600" }}>
            Forums
          </h2>
          <p style={{ fontSize: "1rem", opacity: "0.9" }}>
            Engage in community discussions.
          </p>
        </div>
      </div>

      {/* Navigate to /student/ Button */}
      <button
        onClick={() => router.push("/student/")}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          fontSize: "1.2rem",
          backgroundColor: "#9CA3AF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow =
            "0px 6px 15px rgba(0, 0, 0, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0px 4px 10px rgba(0, 0, 0, 0.2)";
        }}
      >
        Go to Student Portal
      </button>
    </div>
  );
};

export default Home;
