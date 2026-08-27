INSERT INTO categories (name) VALUES ('Objects'), ('Textiles'), ('Lighting') ON CONFLICT (name) DO NOTHING;
INSERT INTO products (name, description, price, image_url, status, category_id)
SELECT v.name, v.description, v.price, v.image_url, 'ACTIVE', c.id
FROM (VALUES
 ('Arc Vessel','Sculptural stoneware for quiet rituals',148.00,'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85','Objects'),
 ('Linen Cloud Throw','Washed linen softness, finished by hand',124.00,'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85','Textiles'),
 ('Halo Table Light','A warm pool of light for late evenings',218.00,'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85','Lighting'),
 ('Cove Carafe','A considered shape for the everyday table',86.00,'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=85','Objects'),
 ('Dune Candle','Cedar, iris, and a little evening air',42.00,'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85','Objects'),
 ('Frame Lounge Chair','Low-slung comfort in natural oak',890.00,'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=900&q=85','Objects')
) AS v(name, description, price, image_url, category_name)
JOIN categories c ON c.name = v.category_name
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name = v.name);
