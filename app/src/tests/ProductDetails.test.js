import React from "react";
import { act, fireEvent, queryByText, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ProductDetails from "../pages/ProductDetails";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <div>Navbar</div>)
jest.mock("../components/Footer", () => () => <div>Footer</div>)
jest.mock("../components/Loading", () => () => <div>Loading...</div>)
jest.mock("../styles/ProductDetails.module.css", () => ({}))

function mockFetch() {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(
                {
                    id: 1,
                    title: "Test Product1",
                    description: "Description1",
                    images: ["/game-imgs/teste1"],
                    categories: ["category1", "category2", "category3"],
                    price: 50.5,
                    quantityInStock: 2
                }
            ),
            ok: true,
            status: 200
        })
    );
}

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
        <MemoryRouter initialEntries={[{ pathname: "/product/1", state: null }]}>
            <Routes>
                <Route path="/product/:id" element={<ProductDetails/>}/>
            </Routes>
        </MemoryRouter>
    )
}

describe("ProductDetails page", () => {
    it("renders without crashing", async () => {
        mockFetch()
        sessionStorage.setItem("cart", JSON.stringify([]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const title = screen.getByText("Test Product1")
        expect(title).toBeInTheDocument()
    })

    it("prevents buying more than what is in stock", async () => {
        mockFetch()
        sessionStorage.setItem("cart", JSON.stringify([]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        let increaseQntBtn = screen.getByText("+")
        fireEvent.click(increaseQntBtn)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        increaseQntBtn = screen.queryByText("+")
        expect(increaseQntBtn).not.toBeInTheDocument()
    })

    it("prevents buying less than or equal to zero products", async () => {
        mockFetch()
        sessionStorage.setItem("cart", JSON.stringify([]))
        renderPage()
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        const decreaseQntBtn = screen.getByText("-")
        fireEvent.click(decreaseQntBtn)
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });
        
        const quantityElem = screen.queryByText("Quantidade: 1")
        expect(quantityElem).toBeInTheDocument()
    })
})