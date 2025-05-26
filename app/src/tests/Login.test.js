import React from "react";
import { act, fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";

// Mock dependencies
jest.mock("../styles/Login.module.css", () => ({}))

class sessionStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }
}
global.sessionStorage = new sessionStorageMock;

function renderPage() {
    return render(
      <MemoryRouter initialEntries={[{ pathname: "/login" }]}>
        <Routes>
          <Route path="/" element={<div></div>}/>
          <Route path="/login" element={<Login/>} />
        </Routes>
      </MemoryRouter>
    )
}

describe("Login page", () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it("renders without crashing", async () => {
    renderPage()
    const title = await screen.findByText('Login')
    expect(title).toBeInTheDocument()
  })

  it("prevents logging with invalid email", async () => {
    sessionStorage.setItem("users", JSON.stringify([{ id: 1, email: "test@gmail.com", password: "123" }]))
    renderPage()

    const emailInput = screen.getByPlaceholderText("Email:")
    const passwordInput = screen.getByPlaceholderText("Senha:")
    const submitBtn = screen.getByText("Entrar")

    fireEvent.change(emailInput, { target: { value: "teste" } })
    fireEvent.change(passwordInput, { target: { value: "123" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const error1 = screen.queryByText("Email inválido")
    const error2 = screen.queryByText("Email e/ou senha incorretos")
    expect(error1).not.toBeNull()
    expect(error2).toBeNull()
  })

  it("prevents logging with incorrect email-password combination", async () => {
    sessionStorage.setItem("users", JSON.stringify([{ id: 1, email: "test@gmail.com", password: "123" }]))
    renderPage()

    const emailInput = screen.getByPlaceholderText("Email:")
    const passwordInput = screen.getByPlaceholderText("Senha:")
    const submitBtn = screen.getByText("Entrar")

    fireEvent.change(emailInput, { target: { value: "teste@gmail.com" } })
    fireEvent.change(passwordInput, { target: { value: "notthecorrectpassword" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const error1 = screen.queryByText("Email inválido")
    const error2 = screen.queryByText("Email e/ou senha incorretos")
    expect(error1).toBeNull()
    expect(error2).not.toBeNull()
  })

  it("allows login with valid and correct data", async () => {
    sessionStorage.setItem("users", JSON.stringify([{ id: 1, email: "test@gmail.com", password: "123" }]))
    renderPage()

    const emailInput = screen.getByPlaceholderText("Email:")
    const passwordInput = screen.getByPlaceholderText("Senha:")
    const submitBtn = screen.getByText("Entrar")

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } })
    fireEvent.change(passwordInput, { target: { value: "123" } })
    fireEvent.click(submitBtn)
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });
    
    const error1 = screen.queryByText("Email inválido")
    const error2 = screen.queryByText("Email e/ou senha incorretos")
    expect(error1).toBeNull()
    expect(error2).toBeNull()
  })
})