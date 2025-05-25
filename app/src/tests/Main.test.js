import React from "react";
import { act, fireEvent, getAllByAltText, getByAltText, getByText, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Main from "../pages/Main";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <div>Navbar</div>)
jest.mock("../components/Footer", () => () => <div>Footer</div>)
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/Main.module.css", () => ({}))

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
                },
                {
                    id: 3,
                    title: "Test Product3",
                    description: "Description3",
                    images: ["/game-imgs/teste3"],
                    categories: ["category1", "category2", "category3"],
                    price: 50.5,
                    quantityInStock: 10
                },
                {
                    id: 4,
                    title: "Test Product4",
                    description: "Description4",
                    images: ["/game-imgs/teste4"],
                    categories: ["category1", "category2", "category3"],
                    price: 50.5,
                    quantityInStock: 10
                },
                {
                    id: 5,
                    title: "Test Product5",
                    description: "Description5",
                    images: ["/game-imgs/teste5"],
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

describe("Main page", () => {
    jest.setTimeout(25000)
    it("renders without crashing", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/", state: null }]}>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const category1 = screen.queryByRole("heading", { name: "category1" })
        const category2 = screen.queryByRole("heading", { name: "category2" })
        const category3 = screen.queryByRole("heading", { name: "category3" })
        expect(category1).toBeInTheDocument()
        expect(category2).toBeInTheDocument()
        expect(category3).toBeInTheDocument()
    })

    it("has a working banner", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/", state: null }]}>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        let currentImg  = screen.queryByAltText("Banner")
        expect(currentImg.src).toContain("/game-imgs/hollow-knight-banner.png")
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 6000));
        });

        currentImg  = screen.queryByAltText("Banner")
        expect(currentImg.src).toContain("/game-imgs/celeste-banner.png")
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        });

        currentImg  = screen.queryByAltText("Banner")
        expect(currentImg.src).toContain("/game-imgs/ori-and-the-blind-forest-banner.jpg")
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 6000));
        });

        currentImg  = screen.queryByAltText("Banner")
        expect(currentImg.src).toContain("/game-imgs/hollow-knight-banner.png")
    })

    it("walks through products inside a category", async () => {
        mockFetch()
        render(
            <MemoryRouter initialEntries={[{ pathname: "/", state: null }]}>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                </Routes>
            </MemoryRouter>
        )
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const nextElem = screen.getAllByAltText("Próximo")[0]
        fireEvent.click(nextElem)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const lastProduct = screen.queryByText("Test Product5")
        expect(lastProduct).toBeInTheDocument()
    })
})