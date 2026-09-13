export default function InstagramReelsSection() {
  const reels: Array<{ id: string; label: string }> = [
    { id: "DcqJao4zXWH", label: "Nahari King Reel 1" },
    { id: "DcS9_mruNS6", label: "Nahari King Reel 2" },
    { id: "DbGksWkz7HK", label: "Nahari King Reel 3" },
    { id: "DSwdwWpjMOf", label: "Nahari King Reel 4" },
  ];

  const instagramProfileUrl = "https://www.instagram.com/thenahariking/";
  const crestPath = "/nahari-king-crest.png";

  return (
    <section className="instagramReelsSection" aria-labelledby="nahari-king-reels-title">
      <style>{`
        :root {
          --nahari-crimson: #7A0C0E;
          --nahari-crimson-dark: #3b0305;
          --nahari-gold: #D4AF37;
          --nahari-gold-soft: rgba(212, 175, 55, 0.22);
          --nahari-white: #fff8ec;
          --nahari-ink: #130506;
        }

        .instagramReelsSection,
        .instagramReelsSection *,
        .instagramReelsSection *::before,
        .instagramReelsSection *::after {
          box-sizing: border-box;
        }

        .instagramReelsSection {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          position: relative;
          isolation: isolate;
          padding: clamp(44px, 7vw, 86px) 0;
          color: var(--nahari-white);
          background:
            radial-gradient(circle at top left, rgba(212, 175, 55, 0.2), transparent 34%),
            radial-gradient(circle at bottom right, rgba(122, 12, 14, 0.72), transparent 38%),
            linear-gradient(135deg, #180607 0%, var(--nahari-crimson-dark) 48%, #090203 100%);
        }

        .instagramReelsSection::before,
        .instagramReelsSection::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: -1;
        }

        .instagramReelsSection::before {
          inset: 18px;
          border: 1px solid rgba(212, 175, 55, 0.22);
          border-radius: 28px;
        }

        .instagramReelsSection::after {
          width: min(680px, 86vw);
          height: min(680px, 86vw);
          right: -18%;
          top: 8%;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.14), transparent 64%);
          filter: blur(2px);
        }

        .pageShell {
          width: min(1180px, 100%);
          max-width: 100%;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 32px);
          position: relative;
          z-index: 1;
        }

        .heroHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          margin-bottom: clamp(28px, 5vw, 46px);
          padding: clamp(18px, 3vw, 28px);
          border: 1px solid rgba(212, 175, 55, 0.42);
          border-radius: 26px;
          background:
            linear-gradient(135deg, rgba(122, 12, 14, 0.94), rgba(45, 4, 6, 0.88)),
            linear-gradient(90deg, rgba(212, 175, 55, 0.16), transparent);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .badgeWrap {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
        }

        .crestFrame {
          width: 76px;
          height: 76px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 22px;
          border: 1px solid rgba(212, 175, 55, 0.58);
          background:
            radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.18), transparent 32%),
            linear-gradient(145deg, rgba(212, 175, 55, 0.22), rgba(122, 12, 14, 0.72));
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.34),
            inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .crestFrame img {
          width: 54px;
          height: 54px;
          object-fit: contain;
          display: block;
        }

        .badgeCopy {
          min-width: 0;
        }

        .officialLabel {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
          color: var(--nahari-gold);
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .officialLabel::before {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--nahari-gold);
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.78);
        }

        .badgeCopy h1 {
          margin: 0;
          color: var(--nahari-white);
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2rem, 4.8vw, 4.35rem);
          line-height: 0.95;
          letter-spacing: -0.045em;
          text-wrap: balance;
        }

        .badgeCopy p {
          max-width: 620px;
          margin: 10px 0 0;
          color: rgba(255, 248, 236, 0.82);
          font-size: clamp(0.96rem, 1.5vw, 1.08rem);
          line-height: 1.6;
        }

        .followButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex: 0 0 auto;
          max-width: 100%;
          min-height: 54px;
          padding: 10px 18px;
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #f9ce34 0%, #ee2a7b 48%, #6228d7 100%);
          box-shadow:
            0 16px 38px rgba(238, 42, 123, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.28);
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
        }

        .followButton:hover,
        .followButton:focus-visible {
          transform: translateY(-2px);
          filter: saturate(1.08);
          box-shadow:
            0 20px 46px rgba(238, 42, 123, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.32);
          outline: none;
        }

        .followButton img {
          width: 30px;
          height: 30px;
          object-fit: contain;
          display: block;
          flex: 0 0 auto;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.24);
        }

        .followButton span {
          overflow-wrap: anywhere;
        }

        .reelGrid {
          width: 100%;
          max-width: 100%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 2vw, 24px);
        }

        .reelCard {
          min-width: 0;
          overflow: hidden;
          position: relative;
          border-radius: 24px;
          border: 1px solid rgba(212, 175, 55, 0.34);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.025)),
            linear-gradient(145deg, rgba(122, 12, 14, 0.82), rgba(18, 2, 4, 0.94));
          box-shadow:
            0 22px 58px rgba(0, 0, 0, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .reelCard::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 4px;
          background: linear-gradient(90deg, var(--nahari-crimson), var(--nahari-gold), var(--nahari-crimson));
          z-index: 2;
        }

        .reelFrame {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          height: 480px;
          display: block;
          border: 0;
          background: #050102;
        }

        .reelBody {
          padding: 16px;
          border-top: 1px solid rgba(212, 175, 55, 0.22);
          background:
            linear-gradient(135deg, rgba(122, 12, 14, 0.42), rgba(0, 0, 0, 0.16)),
            rgba(5, 1, 2, 0.28);
        }

        .reelTitle {
          margin: 0 0 14px;
          color: rgba(255, 248, 236, 0.94);
          font-size: 0.95rem;
          font-weight: 800;
          line-height: 1.35;
        }

        .watchButton {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 46px;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(212, 175, 55, 0.52);
          color: #1b0707;
          background: linear-gradient(135deg, #fff2c2, var(--nahari-gold));
          text-decoration: none;
          font-weight: 900;
          letter-spacing: -0.01em;
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.24),
            inset 0 1px 0 rgba(255, 255, 255, 0.72);
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
        }

        .watchButton:hover,
        .watchButton:focus-visible {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow:
            0 16px 34px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.78);
          outline: none;
        }

        .watchButton svg {
          width: 18px;
          height: 18px;
          flex: 0 0 auto;
        }

        @media (min-width: 700px) and (max-width: 1099px) {
          .reelGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .heroHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .followButton {
            width: 100%;
          }
        }

        @media (max-width: 699px) {
          .instagramReelsSection {
            padding: 34px 0;
          }

          .pageShell {
            padding: 0 12px;
          }

          .heroHeader {
            border-radius: 22px;
          }

          .badgeWrap {
            align-items: flex-start;
          }

          .crestFrame {
            width: 62px;
            height: 62px;
            border-radius: 18px;
          }

          .crestFrame img {
            width: 44px;
            height: 44px;
          }

          .reelGrid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }

          .reelCard {
            border-radius: 20px;
          }

          .reelBody {
            padding: 14px;
          }
        }

        @media (max-width: 380px) {
          .badgeWrap {
            gap: 12px;
          }

          .crestFrame {
            width: 56px;
            height: 56px;
          }

          .crestFrame img {
            width: 40px;
            height: 40px;
          }

          .followButton,
          .watchButton {
            font-size: 0.92rem;
          }
        }
      `}</style>

      <div className="pageShell">
        <header className="heroHeader">
          <div className="badgeWrap" aria-label="Official Nahari King badge">
            <div className="crestFrame" aria-hidden="true">
              <img src={crestPath} alt="" />
            </div>

            <div className="badgeCopy">
              <div className="officialLabel">Official</div>
              <h1 id="nahari-king-reels-title">Nahari King</h1>
              <p>
                Royal Instagram reel showcase with direct fallback links to every official
                @thenahariking reel.
              </p>
            </div>
          </div>

          <a
            className="followButton"
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow @thenahariking on Instagram"
          >
            <img src={crestPath} alt="" aria-hidden="true" />
            <span>Follow @thenahariking</span>
          </a>
        </header>

        <div className="reelGrid" aria-label="Nahari King Instagram reels">
          {reels.map((reel) => (
            <article className="reelCard" key={reel.id}>
              <iframe
                src={`https://www.instagram.com/reel/${reel.id}/embed/`}
                width="100%"
                height="480"
                frameBorder={0}
                scrolling="no"
                allowTransparency={true}
                loading="lazy"
                title={reel.label}
                className="reelFrame"
              />

              <div className="reelBody">
                <p className="reelTitle">{reel.label}</p>

                <a
                  className="watchButton"
                  href={`https://www.instagram.com/reel/${reel.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch ${reel.label} on Instagram`}
                >
                  <span>Watch on Instagram</span>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M7 17L17 7M17 7H9M17 7V15"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}