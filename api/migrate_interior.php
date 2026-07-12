<?php
require_once 'config.php';

try {
    // 1. Create interior table
    $pdo->exec("CREATE TABLE IF NOT EXISTS interior (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        style VARCHAR(100) NOT NULL,
        materials VARCHAR(255) NOT NULL,
        year VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Table 'interior' created or verified successfully.\n";

    // 2. Clear table and seed 10 fresh entries
    $pdo->exec("TRUNCATE TABLE interior");

    $seedData = [
        [
            'title' => 'Modern Living Room',
            'description' => 'A warm, light-filled spatial design prioritizing seamless transitions, bespoke linen furniture, and raw oak woodwork panels.',
            'image' => 'assets/images/interior_living.jpg',
            'category' => 'Residential',
            'style' => 'Modern Luxury',
            'materials' => 'Oak Wood, Linen, Brass',
            'year' => '2025'
        ],
        [
            'title' => 'Minimalist Kitchen',
            'description' => 'Engineered culinary layout featuring invisible touch-to-open cabinets, integrated energy-saving lighting, and custom Carrara marble backdrops.',
            'image' => 'assets/images/interior_kitchen.jpg',
            'category' => 'Culinary',
            'style' => 'Contemporary Minimalist',
            'materials' => 'Quartz Countertops, Carrara Marble',
            'year' => '2025'
        ],
        [
            'title' => 'Premium Master Bedroom',
            'description' => 'A wellness-focused design with integrated acoustic wood framing, warm layered task lamps, and curated cotton textures.',
            'image' => 'assets/images/interior_bedroom.jpg',
            'category' => 'Residential',
            'style' => 'Nordic Organic',
            'materials' => 'Acoustic Wood, Cotton Fabrics',
            'year' => '2025'
        ],
        [
            'title' => 'Oak Dinette Studio',
            'description' => 'An open-air dining concept blending natural oak tables with organic woven textures and panoramic floor-to-ceiling glass integration.',
            'image' => 'assets/images/interior_dining.jpg',
            'category' => 'Dining',
            'style' => 'Biophilic Rustic',
            'materials' => 'Natural Oak Wood, Woven Textures',
            'year' => '2025'
        ],
        [
            'title' => 'Luxury Spa Bathroom',
            'description' => 'A wellness sanctuary utilizing large-format porcelain stone tiling, recessed ambient dimming, and matte-black custom hardware.',
            'image' => 'assets/images/interior_bathroom.jpg',
            'category' => 'Wellness',
            'style' => 'Japandi Spa',
            'materials' => 'Porcelain Stone, Matte-black Metals',
            'year' => '2025'
        ],
        [
            'title' => 'Executive Home Office',
            'description' => 'A quiet workspace layout blending walnut veneer cabinetry, customized sound absorption panels, and ergonomic focus zones.',
            'image' => 'assets/images/interior_office.jpg',
            'category' => 'Workplace',
            'style' => 'Executive Modern',
            'materials' => 'Walnut Veneer, Sound-absorbing Foam',
            'year' => '2025'
        ],
        [
            'title' => 'Minimalist Corridor',
            'description' => 'A modern luxury building corridor featuring custom linear lighting recessed into warm oak wood panels.',
            'image' => 'assets/images/interior_corridor.jpg',
            'category' => 'Commercial',
            'style' => 'Minimalist Modern',
            'materials' => 'Oak Wood, LED Tracks, Raw Concrete',
            'year' => '2025'
        ],
        [
            'title' => 'Playful Kids Bedroom',
            'description' => 'A premium kids bedroom utilizing organic cotton textiles, biophilic wooden toy storage, and cozy pastel task lights.',
            'image' => 'assets/images/interior_kids.jpg',
            'category' => 'Residential',
            'style' => 'Scandinavian Playful',
            'materials' => 'Linden Wood, Organic Cotton, Pastel Laminates',
            'year' => '2025'
        ],
        [
            'title' => 'Premium Walk-in Closet',
            'description' => 'A sleek, customized dressing closet with warm built-in LED tracking, smoked-glass sliding doors, and leather pulls.',
            'image' => 'assets/images/interior_closet.jpg',
            'category' => 'Residential',
            'style' => 'Contemporary Luxury',
            'materials' => 'Walnut, Smoked Glass, LED Channels',
            'year' => '2025'
        ],
        [
            'title' => 'Panoramic Balcony Deck',
            'description' => 'A luxury terrace lounge offering sunset panoramic views, composite weather-resistant decking, and biophilic vertical gardens.',
            'image' => 'assets/images/interior_balcony.jpg',
            'category' => 'Residential',
            'style' => 'Terrace Biophilic',
            'materials' => 'Composite Wood, Powder-coated Steel, Planters',
            'year' => '2025'
        ]
    ];

    $insertStmt = $pdo->prepare("INSERT INTO interior (title, description, image, category, style, materials, year) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($seedData as $item) {
        $insertStmt->execute([
            $item['title'],
            $item['description'],
            $item['image'],
            $item['category'],
            $item['style'],
            $item['materials'],
            $item['year']
        ]);
    }
    echo "Table 'interior' seeded successfully with " . count($seedData) . " items.\n";

} catch (\PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
