import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ticket.module.css"; // Pastikan path ini benar
import birdImage from "../assets/gambar-ujung-kanan.png"; // Pastikan path ini benar

// Impor path ke file SVG Anda
// Sesuaikan path ini dengan lokasi file SVG Anda yang sebenarnya!
import calendarIconUrl from "../assets/calender_black.svg"; // Contoh nama file
import ticketIconUrl from "../assets/ticket.svg"; // Contoh nama file

// Fungsi helper (formatDateTimeForTicketDisplay, formatStatus - tetap sama seperti sebelumnya)
const formatDateTimeForTicketDisplay = (dateTimeString) => {
  if (!dateTimeString) return "Tanggal & Waktu Tidak Tersedia";
  try {
    const dateObj = new Date(dateTimeString);
    const dateOptions = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions);
    const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true };
    const formattedTime = dateObj.toLocaleTimeString("en-US", timeOptions);
    return `${formattedDate} • ${formattedTime}`;
  } catch (e) {
    console.error("Error formatting date for ticket card:", e);
    return "Format Tanggal/Waktu Salah";
  }
};

const formatStatus = (status) => {
  if (!status) return "N/A";
  const statusMap = {
    pending: "Menunggu Pembayaran",
    paid: "Lunas",
    success: "Berhasil",
    completed: "Selesai",
    failed: "Gagal",
    cancelled: "Dibatalkan",
  };
  return (
    statusMap[status.toLowerCase()] ||
    status.charAt(0).toUpperCase() + status.slice(1)
  );
};

const TicketCard = ({ ticket, onDelete }) => {
  const [venueInfo, setVenueInfo] = useState(null);
  const [isVenueLoading, setIsVenueLoading] = useState(false);
  const [venueError, setVenueError] = useState(null);

  if (!ticket || !ticket.ticket_orders || ticket.ticket_orders.length === 0) {
    return (
      <div
        className={styles.ticket}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "120px",
          padding: "20px",
        }}
      >
        <p>Informasi tiket tidak lengkap atau tidak tersedia.</p>
      </div>
    );
  }

  const firstTicketOrderItem = ticket.ticket_orders[0];
  const concertDetails = firstTicketOrderItem.ticket.concert;
  const venueId = concertDetails?.venue_id;

  useEffect(() => {
    // ... (logika fetchVenueDetails tetap sama seperti sebelumnya) ...
    if (!venueId) {
      setVenueInfo({ name: "Lokasi Tidak Ditentukan", city: "" });
      setVenueError(null);
      return;
    }
    let isMounted = true;
    const fetchVenueDetails = async () => {
      setIsVenueLoading(true);
      setVenueError(null);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/venues/${venueId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (isMounted) {
          if (response.data && response.data.status === "success") {
            const venueData = response.data.data;
            setVenueInfo({
              name: venueData.name,
              city: venueData.city?.name || "",
            });
          } else {
            setVenueError(`Detail venue (ID: ${venueId}) tidak ditemukan.`);
            setVenueInfo(null);
          }
        }
      } catch (error) {
        if (isMounted) {
          setVenueError(`Gagal memuat detail venue (ID: ${venueId}).`);
          setVenueInfo(null);
        }
      } finally {
        if (isMounted) {
          setIsVenueLoading(false);
        }
      }
    };
    fetchVenueDetails();
    return () => {
      isMounted = false;
    };
  }, [venueId]);

  const concertName = concertDetails.name || "Nama Konser Tidak Diketahui";
  const dateTimeDisplay = formatDateTimeForTicketDisplay(
    concertDetails.concert_start
  );
  const orderStatus = formatStatus(ticket.status);
  const ticketTypesString = ticket.ticket_orders
    .map((item) => `${item.quantity}x ${item.ticket.name}`)
    .join(", ");

  let venueDisplay;
  if (isVenueLoading) {
    venueDisplay = "Memuat lokasi...";
  } else if (venueError) {
    venueDisplay = (
      <span style={{ color: "red", fontSize: "0.8em" }}>{venueError}</span>
    );
  } else if (venueInfo && venueInfo.name) {
    venueDisplay = `${venueInfo.name}${
      venueInfo.city ? `, ${venueInfo.city}` : ""
    }`;
  } else {
    venueDisplay = venueId
      ? `Lokasi (ID: ${venueId})`
      : "Lokasi Tidak Tersedia";
  }

  // Gaya untuk ikon (tag <img>), bisa juga ditaruh di CSS Modules
  const iconStyle = {
    marginRight: "8px", // Jarak antara ikon dan teks
    width: "16px", // Sesuaikan ukuran ikon
    height: "16px", // Sesuaikan ukuran ikon
    verticalAlign: "middle", // Untuk alignment vertikal yang lebih baik dengan teks
  };

  return (
    <div className={styles.ticket}>
      <div className={styles.ticketLeft} >
        <h2 style={{ fontWeight: "bold", fontSize: "16px" }}>{concertName}</h2>
        <p>{venueDisplay}</p>
        {/* Menggunakan tag <img> untuk ikon kalender */}
        <p style={{ display: "flex", alignItems: "center" }}>
          <img src={calendarIconUrl} alt="Tanggal" style={iconStyle} />{" "}
          {dateTimeDisplay}
        </p>
        {/* Menggunakan tag <img> untuk ikon tiket */}
        <p style={{ display: "flex", alignItems: "center" }}>
          <img src={ticketIconUrl} alt="Tiket" style={iconStyle} />{" "}
          {ticketTypesString}
        </p>
        <p style={{ marginTop: "8px", fontWeight: "500", fontSize: "0.8rem" }}>
          Status:{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                orderStatus === "Lunas" ||
                orderStatus === "Berhasil" ||
                orderStatus === "Selesai"
                  ? "black"
                  : orderStatus === "Menunggu Pembayaran"
                  ? "black"
                  : "black",
            }}
          >
            {orderStatus}
          </span>
        </p>
      </div>

      <div className={styles.ticketRight}>
        <div className={styles.gradientOverlay}></div>
        <img
          src={birdImage}
          alt="Ilustrasi tiket"
          className={styles.ticketImage}
        />
      </div>
    </div>
  );
};

export default TicketCard;
