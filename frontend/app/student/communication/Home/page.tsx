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
        background: "linear-gradient(to bottom right, #1e3c72, #2a5298)",
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
            background:
              "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
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
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0px 10px 25px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
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
            background:
              "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
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
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0px 10px 25px rgba(0, 0, 0, 0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow =
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
      </div>
    </div>
  );
};

export default Home;