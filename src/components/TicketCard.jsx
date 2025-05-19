import React from "react";
import styles from "./ticket.module.css";
import ticketImage from "../assets/ticket-polos.png";
import birdImage from "../assets/gambar-ujung-kanan.png"; // pastikan path-nya benar

const TicketCard = () => {
  return (
    <div className={styles.ticket}>
      <div className={styles.ticketLeft}>
        <h2>Hindia: Doves, '25 on Blank Canvas Live</h2>
        <p>Jakarta International Stadium, Jakarta</p>
        <p>📅 June 15, 2025 • 7:30 PM</p>
        <p>🎟️ 1x Regular Ticket</p>
      </div>
      <div className={styles.ticketRight}>
        <div className={styles.gradientOverlay}></div>
        <img
          src={birdImage}
          alt="Bird"
          className={styles.ticketImage}
        />
      </div>
    </div>
  );
};

export default TicketCard;
