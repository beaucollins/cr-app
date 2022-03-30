import React, { Reducer, useEffect, useReducer } from "react";
import { createRoot } from "react-dom/client";
import styled, { css, createGlobalStyle } from "styled-components";

const RootStyles = css`
  #cr-app {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 320px;
    background-color: #fffc;

    overflow: hidden auto;

    display: flex;
    flex-direction: column;

    align-items: stretch;
    justify-content: stretch;

    z-index: 100;
  }
`;

const Style = createGlobalStyle`
  ${RootStyles}
`;

const List = styled.div``;

const comms = document.createElement("script");

const src = chrome.runtime.getURL("/dist/comm.js");

comms.src = src;

document.documentElement.prepend(comms);

const container = document.createElement("div");
container.setAttribute("id", "cr-app");
const root = createRoot(container);

document.body.appendChild(container);

console.log("ours", document.querySelector("#cr-app"));

type Action = {
  type: "dispatch";
  action: Record<string, unknown>;
};

const AppState: Reducer<string[], Action> = (
  prevState: string[],
  action: Action
) => {
  switch (action.type) {
    case "dispatch": {
      console.log("dispatched", action.action);
      switch (action.action.type) {
        case "@@router/LOCATION_CHANGE":
          console.log("got a location", action.action.payload);
          if (action.action.payload.pathname === "/question") {
            return [atob(action.action.payload.hash.slice(1)), ...prevState];
          }
          return prevState;
      }
      return prevState;
    }
  }

  return prevState;
};

const Hello = () => {
  const [state, dispatch] = useReducer(AppState, []);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      console.log("posted", event);
      dispatch(event.data);
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [dispatch]);
  return (
    <List>
      <ul>
        {state.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </List>
  );
};

root.render(
  <>
    <Style />
    <Hello />
  </>
);
