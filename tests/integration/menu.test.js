import request from "supertest";
import app from "../../server.js";
import MenuItem from "../../models/MenuItem.js";

describe("Menu API Integration Tests", () => {
  beforeEach(async () => {
    await MenuItem.deleteMany({});
    
    // Додаємо тестові товари
    await MenuItem.create([
      {
        name: "Test Espresso",
        description: "Test espresso description",
        category: "espresso",
        price: 35,
        available: true,
        preparationTime: 2
      },
      {
        name: "Test Latte",
        description: "Test latte description", 
        category: "latte",
        price: 45,
        available: true,
        preparationTime: 3
      }
    ]);
  });

  describe("GET /api/v1/menu", () => {
    test("should return all menu items", async () => {
      const response = await request(app)
        .get("/api/v1/menu")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(2);
      expect(response.body.data.pagination.totalItems).toBe(2);
    });

    test("should filter menu items by category", async () => {
      const response = await request(app)
        .get("/api/v1/menu?category=espresso")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].category).toBe("espresso");
    });

    test("should paginate results", async () => {
      const response = await request(app)
        .get("/api/v1/menu?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.itemsPerPage).toBe(1);
    });
  });

  describe("GET /api/v1/menu/categories", () => {
    test("should return all categories with counts", async () => {
      const response = await request(app)
        .get("/api/v1/menu/categories")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.categories).toBeInstanceOf(Array);
      
      const espressoCategory = response.body.data.categories.find(cat => cat.category === "espresso");
      expect(espressoCategory.count).toBe(1);
    });
  });

  describe("GET /api/v1/menu/:id", () => {
    test("should return menu item by id", async () => {
      const items = await MenuItem.find();
      const itemId = items[0]._id;

      const response = await request(app)
        .get(`/api/v1/menu/${itemId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.item._id).toBe(itemId.toString());
    });

    test("should return 404 for non-existent item", async () => {
      const fakeId = "507f1f77bcf86cd799439011"; // Valid ObjectId but doesn't exist

      const response = await request(app)
        .get(`/api/v1/menu/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("не знайдено");
    });

    test("should return 400 for invalid id format", async () => {
      const response = await request(app)
        .get("/api/v1/menu/invalid-id")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Невірний формат ID");
    });
  });
});
