"""
Database seeding script for Electronics Shop
Run this script to populate the database with sample data
"""

from server.app import create_app
from server.models import db, User, Category, Product, UserRole
from decimal import Decimal


def seed_database():
    """Seed the database with initial data"""
    app = create_app()

    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()

        # Create admin user
        print("Creating admin user...")
        admin = User(
            email='admin@electronics.com',
            first_name='Admin',
            last_name='User',
            role=UserRole.ADMIN
        )
        admin.set_password('admin123')
        db.session.add(admin)

        # Create manager user
        manager = User(
            email='manager@electronics.com',
            first_name='Manager',
            last_name='User',
            role=UserRole.MANAGER
        )
        manager.set_password('manager123')
        db.session.add(manager)

        # Create sample customer
        customer = User(
            email='customer@example.com',
            first_name='John',
            last_name='Doe',
            phone='+1234567890',
            role=UserRole.CUSTOMER
        )
        customer.set_password('customer123')
        db.session.add(customer)

        # Create categories
        print("Creating categories...")
        categories_data = [
            {
                'name': 'Smartphones',
                'description': 'Latest smartphones and mobile devices',
                'image_url': 'https://example.com/images/smartphones.jpg'
            },
            {
                'name': 'Laptops',
                'description': 'Powerful laptops and notebooks',
                'image_url': 'https://example.com/images/laptops.jpg'
            },
            {
                'name': 'Tablets',
                'description': 'Tablets and e-readers',
                'image_url': 'https://example.com/images/tablets.jpg'
            },
            {
                'name': 'Audio',
                'description': 'Headphones, speakers, and audio equipment',
                'image_url': 'https://example.com/images/audio.jpg'
            },
            {
                'name': 'Gaming',
                'description': 'Gaming consoles and accessories',
                'image_url': 'https://example.com/images/gaming.jpg'
            },
            {
                'name': 'Wearables',
                'description': 'Smartwatches and fitness trackers',
                'image_url': 'https://example.com/images/wearables.jpg'
            }
        ]

        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            categories.append(category)
            db.session.add(category)

        db.session.flush()  # Get category IDs

        # Create products
        print("Creating products...")
        products_data = [
            # Smartphones
            {
                'name': 'iPhone 15 Pro',
                'description': 'Latest iPhone with A17 Pro chip and titanium design',
                'price': Decimal('999.00'),
                'sale_price': Decimal('949.00'),
                'sku': 'IPHONE15PRO-128',
                'stock_quantity': 50,
                'brand': 'Apple',
                'model': 'iPhone 15 Pro',
                'warranty_months': 24,
                'is_featured': True,
                'category_id': categories[0].id,
                'image_urls': [
                    'https://example.com/images/iphone15pro-1.jpg',
                    'https://example.com/images/iphone15pro-2.jpg'
                ],
                'specifications': {
                    'Display': '6.1-inch Super Retina XDR',
                    'Processor': 'A17 Pro chip',
                    'Storage': '128GB',
                    'Camera': '48MP Main camera',
                    'Battery': 'Up to 23 hours video playback'
                }
            },
            {
                'name': 'Samsung Galaxy S24',
                'description': 'Premium Android smartphone with AI features',
                'price': Decimal('899.00'),
                'sku': 'GALAXY-S24-256',
                'stock_quantity': 30,
                'brand': 'Samsung',
                'model': 'Galaxy S24',
                'warranty_months': 24,
                'is_featured': True,
                'category_id': categories[0].id,
                'image_urls': [
                    'https://example.com/images/galaxy-s24-1.jpg',
                    'https://example.com/images/galaxy-s24-2.jpg'
                ],
                'specifications': {
                    'Display': '6.2-inch Dynamic AMOLED 2X',
                    'Processor': 'Snapdragon 8 Gen 3',
                    'Storage': '256GB',
                    'Camera': '50MP Triple camera',
                    'Battery': '4000mAh'
                }
            },
            # Laptops
            {
                'name': 'MacBook Pro 16"',
                'description': 'Professional laptop with M3 Pro chip',
                'price': Decimal('2499.00'),
                'sku': 'MBP16-M3PRO-512',
                'stock_quantity': 20,
                'brand': 'Apple',
                'model': 'MacBook Pro 16"',
                'warranty_months': 12,
                'is_featured': True,
                'category_id': categories[1].id,
                'image_urls': [
                    'https://example.com/images/macbook-pro-16-1.jpg',
                    'https://example.com/images/macbook-pro-16-2.jpg'
                ],
                'specifications': {
                    'Display': '16.2-inch Liquid Retina XDR',
                    'Processor': 'Apple M3 Pro chip',
                    'Memory': '18GB unified memory',
                    'Storage': '512GB SSD',
                    'Graphics': '18-core GPU'
                }
            },
            {
                'name': 'Dell XPS 13',
                'description': 'Ultra-portable Windows laptop',
                'price': Decimal('1299.00'),
                'sale_price': Decimal('1199.00'),
                'sku': 'XPS13-I7-512',
                'stock_quantity': 25,
                'brand': 'Dell',
                'model': 'XPS 13',
                'warranty_months': 12,
                'category_id': categories[1].id,
                'image_urls': [
                    'https://example.com/images/dell-xps-13-1.jpg',
                    'https://example.com/images/dell-xps-13-2.jpg'
                ],
                'specifications': {
                    'Display': '13.4-inch FHD+',
                    'Processor': 'Intel Core i7-1360P',
                    'Memory': '16GB LPDDR5',
                    'Storage': '512GB SSD',
                    'Graphics': 'Intel Iris Xe'
                }
            },
            # Tablets
            {
                'name': 'iPad Pro 12.9"',
                'description': 'Professional tablet with M2 chip',
                'price': Decimal('1099.00'),
                'sku': 'IPADPRO129-M2-128',
                'stock_quantity': 35,
                'brand': 'Apple',
                'model': 'iPad Pro 12.9"',
                'warranty_months': 12,
                'is_featured': True,
                'category_id': categories[2].id,
                'image_urls': [
                    'https://example.com/images/ipad-pro-129-1.jpg',
                    'https://example.com/images/ipad-pro-129-2.jpg'
                ],
                'specifications': {
                    'Display': '12.9-inch Liquid Retina XDR',
                    'Processor': 'Apple M2 chip',
                    'Storage': '128GB',
                    'Camera': '12MP Wide camera',
                    'Connectivity': 'Wi-Fi 6E'
                }
            },
            # Audio
            {
                'name': 'Sony WH-1000XM5',
                'description': 'Premium noise-canceling headphones',
                'price': Decimal('399.00'),
                'sale_price': Decimal('349.00'),
                'sku': 'SONY-WH1000XM5-BLACK',
                'stock_quantity': 40,
                'brand': 'Sony',
                'model': 'WH-1000XM5',
                'warranty_months': 12,
                'is_featured': True,
                'category_id': categories[3].id,
                'image_urls': [
                    'https://example.com/images/sony-wh1000xm5-1.jpg',
                    'https://example.com/images/sony-wh1000xm5-2.jpg'
                ],
                'specifications': {
                    'Type': 'Over-ear wireless headphones',
                    'Noise Canceling': 'Industry-leading ANC',
                    'Battery': 'Up to 30 hours',
                    'Connectivity': 'Bluetooth 5.2',
                    'Features': 'Quick Attention mode'
                }
            },
            {
                'name': 'AirPods Pro (2nd Gen)',
                'description': 'Apple wireless earbuds with ANC',
                'price': Decimal('249.00'),
                'sku': 'AIRPODS-PRO-2GEN',
                'stock_quantity': 60,
                'brand': 'Apple',
                'model': 'AirPods Pro',
                'warranty_months': 12,
                'category_id': categories[3].id,
                'image_urls': [
                    'https://example.com/images/airpods-pro-2gen-1.jpg'
                ],
                'specifications': {
                    'Type': 'In-ear wireless earbuds',
                    'Noise Canceling': 'Active Noise Cancellation',
                    'Battery': 'Up to 6 hours listening time',
                    'Features': 'Adaptive Transparency',
                    'Charging': 'MagSafe compatible case'
                }
            },
            # Gaming
            {
                'name': 'PlayStation 5',
                'description': 'Next-generation gaming console',
                'price': Decimal('499.00'),
                'sku': 'PS5-STANDARD',
                'stock_quantity': 15,
                'brand': 'Sony',
                'model': 'PlayStation 5',
                'warranty_months': 12,
                'is_featured': True,
                'category_id': categories[4].id,
                'image_urls': [
                    'https://example.com/images/ps5-1.jpg',
                    'https://example.com/images/ps5-2.jpg'
                ],
                'specifications': {
                    'Processor': 'AMD Zen 2',
                    'Graphics': 'AMD RDNA 2',
                    'Memory': '16GB GDDR6',
                    'Storage': '825GB SSD',
                    'Resolution': 'Up to 4K 120fps'
                }
            },
            # Wearables
            {
                'name': 'Apple Watch Series 9',
                'description': 'Advanced smartwatch with health features',
                'price': Decimal('399.00'),
                'sku': 'WATCH-S9-45MM-GPS',
                'stock_quantity': 45,
                'brand': 'Apple',
                'model': 'Apple Watch Series 9',
                'warranty_months': 12,
                'category_id': categories[5].id,
                'image_urls': [
                    'https://example.com/images/apple-watch-s9-1.jpg'
                ],
                'specifications': {
                    'Display': '45mm Retina LTPO OLED',
                    'Processor': 'S9 SiP',
                    'Health': 'ECG, Blood Oxygen, Heart Rate',
                    'Battery': 'Up to 18 hours',
                    'Connectivity': 'GPS + Cellular available'
                }
            }
        ]

        for product_data in products_data:
            product = Product(**product_data)
            db.session.add(product)

        # Commit all changes
        print("Committing changes...")
        db.session.commit()

        print("Database seeded successfully!")
        print(f"Created {len(categories)} categories")
        print(f"Created {len(products_data)} products")
        print("Created 3 users")


if __name__ == "__main__":
    seed_database()
