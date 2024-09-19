import { SessionProvider } from "next-auth/react";

import React from "react";

const SessionWrapper = ({ clildren }: { clildren: React.ReactNode }) => {
  return <SessionProvider> {clildren} </SessionProvider>;
};

export default SessionWrapper;
