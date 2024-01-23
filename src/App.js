import React from "react";
import DataSubscriptionProvider from "./DSP";
import "./styles.css";

const logger = {
  warn() {},
  error() {},
  info() {},
  set() {}
};

export default function App() {
  return (
    <DataSubscriptionProvider logger={logger}>
      <p>Put a component that uses DSP here</p>
    </DataSubscriptionProvider>
  );
}
