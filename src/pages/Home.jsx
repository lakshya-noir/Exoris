import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import "../styles/components.css";
import { Link } from "react-router-dom";

const STAR_COLORS = ["#FFFFFF", "#CCE4FF", "#FFF6E0", "#AAC8FF", "#FFE8C0"];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function createStars(width, height) {
  const stars = [];
  const smallCount = Math.floor(320 * 0.6);
  const mediumCount = Math.floor(320 * 0.3);
  const largeCount = 320 - smallCount - mediumCount;

  const pushStar = (minRadius, maxRadius) => {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: randomBetween(minRadius, maxRadius),
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      twinkleSpeed: randomBetween(0.003, 0.012),
      twinkleOffset: randomBetween(0, Math.PI * 2),
      minOpacity: randomBetween(0.15, 0.4),
      maxOpacity: randomBetween(0.75, 1.0),
    });
  };

  for (let i = 0; i < smallCount; i += 1) pushStar(0.3, 0.6);
  for (let i = 0; i < mediumCount; i += 1) pushStar(0.7, 1.2);
  for (let i = 0; i < largeCount; i += 1) pushStar(1.3, 2.0);

  return stars;
}

function spawnComet(width, height) {
  const spawnFromTop = Math.random() < 0.5;
  const startX = spawnFromTop ? Math.random() * width : -20;
  const startY = spawnFromTop ? -20 : Math.random() * (height * 0.6);
  const angle = randomBetween((35 * Math.PI) / 180, (45 * Math.PI) / 180);
  const speed = randomBetween(3.5, 6.5);
  const tailLength = randomBetween(90, 160);

  return {
    x: startX,
    y: startY,
    angle,
    speed,
    vx: speed * Math.cos(angle),
    vy: speed * Math.sin(angle),
    tailLength,
  };
}

function createComets(width, height) {
  const comets = [];
  for (let i = 0; i < 4; i += 1) {
    const comet = spawnComet(width, height);
    const stagger = randomBetween(40, 300) * i;
    comet.x += comet.vx * stagger;
    comet.y += comet.vy * stagger;
    comets.push(comet);
  }
  return comets;
}

function SpaceBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let frame = 0;
    let animationFrameId = 0;
    let stars = [];
    let comets = [];
    let backgroundCanvas = null;
    let nebulaCanvas = null;

    const buildBackground = (width, height) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return offscreen;

      const gradient = offCtx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        0,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.85
      );
      gradient.addColorStop(0, "rgba(10, 15, 40, 1)");
      gradient.addColorStop(1, "rgba(0, 0, 8, 1)");
      offCtx.fillStyle = gradient;
      offCtx.fillRect(0, 0, width, height);
      return offscreen;
    };

    const buildNebula = (width, height) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return offscreen;

      const blobs = [
        {
          x: width * 0.15,
          y: height * 0.75,
          radius: 280,
          color: "rgba(20, 0, 60, 0.06)",
        },
        {
          x: width * 0.8,
          y: height * 0.6,
          radius: 320,
          color: "rgba(0, 30, 80, 0.05)",
        },
      ];

      blobs.forEach((blob) => {
        const gradient = offCtx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        offCtx.fillStyle = gradient;
        offCtx.beginPath();
        offCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        offCtx.fill();
      });

      return offscreen;
    };

    const resetScene = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      backgroundCanvas = buildBackground(width, height);
      nebulaCanvas = buildNebula(width, height);
      stars = createStars(width, height);
      comets = createComets(width, height);
      frame = 0;
    };

    const drawStars = () => {
      stars.forEach((star) => {
        const opacity =
          star.minOpacity +
          (star.maxOpacity - star.minOpacity) *
            (0.5 + 0.5 * Math.sin(frame * star.twinkleSpeed + star.twinkleOffset));
        ctx.globalAlpha = opacity;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const updateComets = () => {
      comets = comets.map((comet) => {
        const next = { ...comet };
        next.x += next.vx;
        next.y += next.vy;
        if (next.x > canvas.width + 200 || next.y > canvas.height + 200) {
          return spawnComet(canvas.width, canvas.height);
        }
        return next;
      });
    };

    const drawComets = () => {
      comets.forEach((comet) => {
        const tailX = comet.x - comet.tailLength * Math.cos(comet.angle);
        const tailY = comet.y - comet.tailLength * Math.sin(comet.angle);

        const grad = ctx.createLinearGradient(tailX, tailY, comet.x, comet.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.7, "rgba(200, 225, 255, 0.3)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.95)");

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(comet.x, comet.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const headGlow = ctx.createRadialGradient(
          comet.x,
          comet.y,
          0,
          comet.x,
          comet.y,
          4
        );
        headGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
        headGlow.addColorStop(0.4, "rgba(180, 220, 255, 0.6)");
        headGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (backgroundCanvas) ctx.drawImage(backgroundCanvas, 0, 0);
      if (nebulaCanvas) ctx.drawImage(nebulaCanvas, 0, 0);
      drawStars();
      updateComets();
      drawComets();
      frame += 1;
      animationFrameId = window.requestAnimationFrame(animate);
    };

    resetScene();
    animate();
    window.addEventListener("resize", resetScene);

    return () => {
      window.removeEventListener("resize", resetScene);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-canvas-bg" aria-hidden="true" />;
}

const Home = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <div className="star-background home-page">
    <SpaceBackgroundCanvas />

    <nav className="home-nav">
      <span className="home-brand">Exoris</span>
      <div className="home-nav-actions">
        <Link className="home-nav-link" to="/solar-system">
          Solar System 3D
        </Link>
        <a
          className="home-nav-link"
          href="/earth-3d/index.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Earth 3D Model
        </a>
      </div>
    </nav>

    <main className="home-hero">
      <section className="home-panel">
        <p className="home-kicker">NASA Media Explorer</p>
        <h1 className="home-title">Discover the universe through curated space imagery</h1>
        <p className="home-description">
          Explore NASA visuals, jump into the interactive Solar System scene, or open
          Earth&apos;s 3D model. Built for fast discovery, immersive learning, and mission-ready
          presentations.
        </p>
        <div className="home-search-wrap">
          <SearchBar placeholder="Search celestial bodies..." onSearchActive={setIsSearchActive} />
        </div>
      </section>
    </main>

    {!isSearchActive && (
      <div className="home-footer-note">
        <span>Data and media sourced from NASA APIs</span>
      </div>
    )}
  </div>
  );
};

export default Home;
