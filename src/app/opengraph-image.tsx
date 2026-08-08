import { ImageResponse } from "next/og";

import { business, formatAddress } from "@/content/business";

export const alt = `${business.name} — restaurant in ${business.address.value.locality}, ${business.address.value.region}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Type and colour only — there is no owner-approved photograph of
 * this restaurant, and a stock image here would misrepresent a real place in
 * exactly the context where people trust an image most.
 */
export default function OpengraphImage() {
  const address = business.address.value;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#14312a",
          color: "#f3f4f0",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 18, height: 18, backgroundColor: "#dca945" }} />
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#dca945",
              fontWeight: 600,
            }}
          >
            {`${business.category.value} · ${address.locality}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 172,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {business.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid #2c4941",
            paddingTop: 28,
            fontSize: 28,
            color: "#a9bab2",
          }}
        >
          <div style={{ display: "flex", flexShrink: 1, paddingRight: 32 }}>
            {formatAddress(address)}
          </div>
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              whiteSpace: "nowrap",
              color: "#f3f4f0",
            }}
          >
            {business.phone.value.display}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
