import React from "react";
import { act, fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Search from "../pages/Search";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <div>Navbar</div>)
jest.mock("../components/Footer", () => () => <div>Footer</div>)
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/Search.module.css", () => ({}))

function mockFetch() {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                {
                    id: 1,
                    title: "Test Product1",
                    description: "Description1",
                    images: ["/game-imgs/teste1"],
                    categories: ["category1", "category2", "category3"],
                    price: 50.5,
                    quantityInStock: 10
                },
                {
                    id: 2,
                    title: "Test Product2",
                    description: "Description2",
                    images: ["/game-imgs/teste2"],
                    categories: ["category1", "category2", "category3"],
                    price: 50.5,
                    quantityInStock: 10
                }
            ]),
            ok: true,
            status: 200
        })
    );
}

describe("Search page", () => {
    it("renders without crashing", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/search", state: null }]}>
                <Routes>
                    <Route path="/search" element={<Search />} />
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const resultTitle1 = screen.queryByRole("heading", { name: "Test Product1" })
        const resultTitle2 = screen.queryByRole("heading", { name: "Test Product2" })
        expect(resultTitle1).toBeInTheDocument()
        expect(resultTitle2).toBeInTheDocument()
    })

    it("searches the string passed by location state", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/search", state: "Test Product1" }]}>
                <Routes>
                    <Route path="/search" element={<Search />} />
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const resultTitle = screen.queryByRole("heading", { name: "Test Product1" })
        const notResultTitle = screen.queryByRole("heading", { name: "Test Product2" })
        expect(resultTitle).toBeInTheDocument()
        expect(notResultTitle).not.toBeInTheDocument()
    })

    it("searches the string passed by the user", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/search", state: null }]}>
                <Routes>
                    <Route path="/search" element={<Search />} />
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const searchBar = screen.getByRole("textbox")
        fireEvent.change(searchBar, { target: { value: "Test Product2" } })
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const resultTitle = screen.queryByRole("heading", { name: "Test Product2" })
        const notResultTitle = screen.queryByRole("heading", { name: "Test Product1" })

        expect(resultTitle).toBeInTheDocument()
        expect(notResultTitle).not.toBeInTheDocument()
    })
})