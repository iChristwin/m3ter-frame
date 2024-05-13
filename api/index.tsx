import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { handle } from "frog/vercel";
import { serveStatic } from "frog/serve-static";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  browserLocation: "https://m3ters.ichristwin.com",
});

app.frame("/", (c) => {
  let seed;
  const { frameData } = c;
  const btn = frameData?.buttonIndex;

  if (btn == 1) seed = frameData?.inputText;
  else if (btn == 2) seed = frameData?.fid.toString();
  else if (btn == 3) {
    const buffer = new Uint8Array(20);
    crypto.getRandomValues(buffer);
    seed = Array.from(buffer)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  console.log(`User: ${frameData?.fid} called frame for seed ${seed}`);

  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        <img src={`https://m3ters.ichristwin.com/api/m3ter-head/png/${seed}`} />
      </div>
    ),
    imageOptions: { height: 500, width: 500 },
    intents: [
      <TextInput placeholder="Enter a custom seed..." />,
      <Button value="apple">use input👆</Button>,
      <Button value="banana">use my FID</Button>,
      <Button value="mango">surprise me!</Button>,
      <Button.Redirect location="https://m3ters.ichristwin.com">
        M3ters.js
      </Button.Redirect>,
    ],
  });
});

// @ts-ignore
if (import.meta.env?.MODE === "development") devtools(app, { serveStatic });
else devtools(app, { assetsPath: "/.frog" });

export const GET = handle(app);
export const POST = handle(app);
