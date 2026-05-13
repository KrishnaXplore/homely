const mongoose = require('mongoose');
require('dotenv').config();

const Remedy = require('../models/Remedy');

const remedies = [
  // ── Immunity Boosters ──────────────────────────────────────────────
  {
    title: 'Golden Turmeric Milk',
    description: 'A warming, anti-inflammatory drink combining turmeric, ginger, and black pepper in warm milk. Known as "haldi doodh" in India, this remedy has been used for centuries to boost immunity and fight infections.',
    category: 'immunity-booster',
    difficulty: 'easy',
    prepTime: 10,
    rating: 4.8,
    reviewsCount: 124,
    ingredients: [
      { name: 'Milk', amount: '1', unit: 'cup' },
      { name: 'Turmeric powder', amount: '1', unit: 'tsp' },
      { name: 'Ginger', amount: '1/2', unit: 'tsp' },
      { name: 'Black pepper', amount: '1/4', unit: 'tsp' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Cinnamon', amount: '1/4', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Heat milk in a small saucepan over medium heat.' },
      { stepNumber: 2, instruction: 'Add turmeric, ginger, cinnamon, and black pepper.' },
      { stepNumber: 3, instruction: 'Whisk well and simmer for 5 minutes, stirring occasionally.' },
      { stepNumber: 4, instruction: 'Remove from heat, let cool slightly, then stir in honey.' },
      { stepNumber: 5, instruction: 'Strain into a mug and drink warm before bed.' },
    ],
  },
  {
    title: 'Elderberry Syrup',
    description: 'Homemade elderberry syrup is a powerful immune booster packed with antioxidants and vitamins. Studies show elderberries can reduce the duration of colds and flu by up to 4 days.',
    category: 'immunity-booster',
    difficulty: 'medium',
    prepTime: 45,
    rating: 4.7,
    reviewsCount: 89,
    ingredients: [
      { name: 'Dried elderberries', amount: '1', unit: 'cup' },
      { name: 'Water', amount: '3', unit: 'cups' },
      { name: 'Cinnamon stick', amount: '1', unit: 'piece' },
      { name: 'Cloves', amount: '5', unit: 'pieces' },
      { name: 'Fresh ginger', amount: '1', unit: 'tbsp' },
      { name: 'Raw honey', amount: '1', unit: 'cup' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Combine elderberries, water, cinnamon, cloves, and ginger in a pot.' },
      { stepNumber: 2, instruction: 'Bring to a boil, then reduce heat and simmer for 30 minutes until liquid reduces by half.' },
      { stepNumber: 3, instruction: 'Remove from heat and cool for 15 minutes.' },
      { stepNumber: 4, instruction: 'Mash the berries and strain through a fine mesh strainer or cheesecloth.' },
      { stepNumber: 5, instruction: 'When liquid is lukewarm, stir in raw honey until dissolved.' },
      { stepNumber: 6, instruction: 'Pour into glass jars and refrigerate. Take 1 tbsp daily for prevention.' },
    ],
  },

  // ── Cold & Cough ───────────────────────────────────────────────────
  {
    title: 'Honey Ginger Lemon Tea',
    description: 'A classic sore throat remedy combining the antibacterial properties of honey, the anti-inflammatory power of ginger, and vitamin C from lemon. Provides instant relief from cold and cough symptoms.',
    category: 'cold-and-cough',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.9,
    reviewsCount: 203,
    ingredients: [
      { name: 'Fresh ginger', amount: '1', unit: 'inch' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Raw honey', amount: '1', unit: 'tbsp' },
      { name: 'Hot water', amount: '1', unit: 'cup' },
      { name: 'Cayenne pepper', amount: '1', unit: 'pinch' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Peel and grate or thinly slice fresh ginger.' },
      { stepNumber: 2, instruction: 'Steep ginger in hot water for 3-5 minutes.' },
      { stepNumber: 3, instruction: 'Strain out ginger pieces.' },
      { stepNumber: 4, instruction: 'Add fresh lemon juice, honey, and a pinch of cayenne pepper.' },
      { stepNumber: 5, instruction: 'Stir well and sip slowly while warm. Repeat 3 times daily.' },
    ],
  },
  {
    title: 'Steam Inhalation with Eucalyptus',
    description: 'Steam inhalation with eucalyptus oil is one of the most effective remedies for congestion and respiratory issues. The eucalyptus acts as a natural decongestant, opening airways and providing immediate relief.',
    category: 'cold-and-cough',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.6,
    reviewsCount: 77,
    ingredients: [
      { name: 'Hot water', amount: '4', unit: 'cups' },
      { name: 'Eucalyptus essential oil', amount: '5-7', unit: 'drops' },
      { name: 'Peppermint oil', amount: '3', unit: 'drops' },
      { name: 'Large towel', amount: '1', unit: 'piece' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Boil water and carefully pour into a large heat-safe bowl.' },
      { stepNumber: 2, instruction: 'Add eucalyptus and peppermint essential oils.' },
      { stepNumber: 3, instruction: 'Position face 10-12 inches above the bowl.' },
      { stepNumber: 4, instruction: 'Drape a large towel over your head to trap the steam.' },
      { stepNumber: 5, instruction: 'Breathe deeply through your nose for 5-10 minutes. Keep eyes closed.' },
    ],
  },
  {
    title: 'Onion and Honey Cough Syrup',
    description: 'This old-fashioned remedy uses the natural antibacterial and expectorant properties of onion combined with honey to create an effective homemade cough syrup that soothes irritated throats.',
    category: 'cold-and-cough',
    difficulty: 'easy',
    prepTime: 180,
    rating: 4.3,
    reviewsCount: 56,
    ingredients: [
      { name: 'Large onion', amount: '1', unit: 'piece' },
      { name: 'Raw honey', amount: '3', unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Peel and finely chop or slice the onion.' },
      { stepNumber: 2, instruction: 'Place onion in a jar and cover with honey.' },
      { stepNumber: 3, instruction: 'Let it sit for 2-3 hours or overnight — the onion will release its juice.' },
      { stepNumber: 4, instruction: 'Take 1 teaspoon of the liquid every few hours as needed for cough.' },
    ],
  },

  // ── Digestive Health ───────────────────────────────────────────────
  {
    title: 'Ginger & Fennel Digestive Tea',
    description: 'This soothing tea combines the digestive powers of ginger and fennel to relieve bloating, indigestion, and nausea. Both herbs have been used in Ayurvedic medicine for thousands of years to support gut health.',
    category: 'digestive-health',
    difficulty: 'easy',
    prepTime: 10,
    rating: 4.7,
    reviewsCount: 98,
    ingredients: [
      { name: 'Fennel seeds', amount: '1', unit: 'tsp' },
      { name: 'Fresh ginger', amount: '1/2', unit: 'inch' },
      { name: 'Hot water', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Lemon juice', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Lightly crush fennel seeds using a mortar and pestle to release oils.' },
      { stepNumber: 2, instruction: 'Slice or grate fresh ginger.' },
      { stepNumber: 3, instruction: 'Add fennel seeds and ginger to a cup of hot water.' },
      { stepNumber: 4, instruction: 'Steep for 7-10 minutes, then strain.' },
      { stepNumber: 5, instruction: 'Add honey and lemon juice. Drink after meals for best results.' },
    ],
  },
  {
    title: 'Aloe Vera Gut Soother',
    description: 'Fresh aloe vera gel is one of nature\'s best digestive aids. It reduces inflammation in the gut lining, relieves acid reflux, and promotes healthy digestion. Best taken on an empty stomach.',
    category: 'digestive-health',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.5,
    reviewsCount: 62,
    ingredients: [
      { name: 'Fresh aloe vera gel', amount: '2', unit: 'tbsp' },
      { name: 'Water', amount: '1', unit: 'cup' },
      { name: 'Lemon juice', amount: '1', unit: 'tsp' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Cut a fresh aloe vera leaf and scoop out 2 tablespoons of clear gel.' },
      { stepNumber: 2, instruction: 'Blend the gel with water until smooth.' },
      { stepNumber: 3, instruction: 'Add lemon juice and honey, stir well.' },
      { stepNumber: 4, instruction: 'Drink immediately on an empty stomach, 20 minutes before breakfast.' },
    ],
  },

  // ── Skin Care ──────────────────────────────────────────────────────
  {
    title: 'Turmeric & Honey Face Mask',
    description: 'This powerful face mask combines the anti-inflammatory and antibacterial properties of turmeric with the moisturizing and healing effects of honey. It brightens skin, reduces acne, and evens out skin tone.',
    category: 'skin-care',
    difficulty: 'easy',
    prepTime: 15,
    rating: 4.8,
    reviewsCount: 187,
    ingredients: [
      { name: 'Turmeric powder', amount: '1/2', unit: 'tsp' },
      { name: 'Raw honey', amount: '1', unit: 'tbsp' },
      { name: 'Plain yogurt', amount: '1', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '1/2', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix all ingredients together in a small bowl until smooth.' },
      { stepNumber: 2, instruction: 'Cleanse your face and pat dry.' },
      { stepNumber: 3, instruction: 'Apply an even layer to your face, avoiding the eye area.' },
      { stepNumber: 4, instruction: 'Leave on for 10-15 minutes.' },
      { stepNumber: 5, instruction: 'Rinse with warm water and pat dry. Note: turmeric may temporarily tint skin yellow.' },
    ],
  },
  {
    title: 'Oatmeal & Honey Soothing Mask',
    description: 'A gentle, deeply nourishing mask perfect for sensitive or dry skin. Oatmeal acts as a natural cleanser and soothes irritation while honey locks in moisture. Great for eczema-prone skin too.',
    category: 'skin-care',
    difficulty: 'easy',
    prepTime: 20,
    rating: 4.6,
    reviewsCount: 143,
    ingredients: [
      { name: 'Ground oatmeal', amount: '2', unit: 'tbsp' },
      { name: 'Raw honey', amount: '1', unit: 'tbsp' },
      { name: 'Warm water', amount: '2', unit: 'tbsp' },
      { name: 'Coconut oil', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Grind plain oats into a fine powder using a blender.' },
      { stepNumber: 2, instruction: 'Mix oat powder with warm water to form a paste.' },
      { stepNumber: 3, instruction: 'Add honey and coconut oil, stir well.' },
      { stepNumber: 4, instruction: 'Apply to clean face and leave for 15-20 minutes.' },
      { stepNumber: 5, instruction: 'Rinse gently with warm water in circular motions for gentle exfoliation.' },
    ],
  },

  // ── Hair Care ─────────────────────────────────────────────────────
  {
    title: 'Coconut Oil & Rosemary Hair Treatment',
    description: 'This deep conditioning treatment combines the moisturizing power of coconut oil with rosemary\'s ability to stimulate hair follicles and promote growth. Regular use strengthens hair and reduces breakage.',
    category: 'hair-care',
    difficulty: 'easy',
    prepTime: 40,
    rating: 4.7,
    reviewsCount: 115,
    ingredients: [
      { name: 'Coconut oil', amount: '3', unit: 'tbsp' },
      { name: 'Rosemary essential oil', amount: '10', unit: 'drops' },
      { name: 'Castor oil', amount: '1', unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Melt coconut oil if solid by placing the jar in warm water.' },
      { stepNumber: 2, instruction: 'Mix in castor oil and rosemary essential oil.' },
      { stepNumber: 3, instruction: 'Section your hair and massage the oil blend into your scalp.' },
      { stepNumber: 4, instruction: 'Work the remaining oil through the lengths of your hair.' },
      { stepNumber: 5, instruction: 'Cover with a shower cap and leave for 30 minutes or overnight.' },
      { stepNumber: 6, instruction: 'Wash out thoroughly with shampoo (may need two rounds). Repeat weekly.' },
    ],
  },
  {
    title: 'Apple Cider Vinegar Hair Rinse',
    description: 'An ACV rinse restores the natural pH balance of your scalp, removes product buildup, adds shine, and combats dandruff. Many people notice softer, shinier hair after just one use.',
    category: 'hair-care',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.5,
    reviewsCount: 91,
    ingredients: [
      { name: 'Apple cider vinegar', amount: '2', unit: 'tbsp' },
      { name: 'Cold water', amount: '1', unit: 'cup' },
      { name: 'Lavender essential oil', amount: '5', unit: 'drops' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix apple cider vinegar with cold water in a small spray bottle or cup.' },
      { stepNumber: 2, instruction: 'Add lavender oil to help mask the vinegar smell.' },
      { stepNumber: 3, instruction: 'After shampooing, pour or spray the rinse over your hair.' },
      { stepNumber: 4, instruction: 'Massage gently into scalp and leave for 1-2 minutes.' },
      { stepNumber: 5, instruction: 'Rinse thoroughly with cold water. The vinegar smell dissipates as hair dries.' },
    ],
  },

  // ── Sleep & Relaxation ────────────────────────────────────────────
  {
    title: 'Chamomile & Lavender Sleep Tea',
    description: 'This calming bedtime tea combines chamomile\'s natural sedative properties with lavender\'s relaxing aroma. Perfect for winding down after a stressful day and promoting deeper, more restful sleep.',
    category: 'sleep-and-relaxation',
    difficulty: 'easy',
    prepTime: 10,
    rating: 4.9,
    reviewsCount: 176,
    ingredients: [
      { name: 'Dried chamomile flowers', amount: '2', unit: 'tsp' },
      { name: 'Dried lavender buds', amount: '1', unit: 'tsp' },
      { name: 'Hot water', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Warm milk', amount: '2', unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Add chamomile and lavender to a tea infuser or strainer.' },
      { stepNumber: 2, instruction: 'Pour just-boiled water over herbs and steep for 5-7 minutes.' },
      { stepNumber: 3, instruction: 'Remove infuser and stir in honey.' },
      { stepNumber: 4, instruction: 'Add a splash of warm milk for extra creaminess.' },
      { stepNumber: 5, instruction: 'Drink 30-60 minutes before bedtime while doing a relaxing activity.' },
    ],
  },
  {
    title: 'Magnesium Foot Soak',
    description: 'A warm Epsom salt foot soak before bed can work wonders for sleep quality. Magnesium absorbed through the skin helps relax muscles, reduce anxiety, and prepare the body for deep sleep.',
    category: 'sleep-and-relaxation',
    difficulty: 'easy',
    prepTime: 20,
    rating: 4.6,
    reviewsCount: 84,
    ingredients: [
      { name: 'Epsom salt', amount: '1/2', unit: 'cup' },
      { name: 'Warm water', amount: 'enough to cover feet', unit: '' },
      { name: 'Lavender essential oil', amount: '5', unit: 'drops' },
      { name: 'Peppermint oil', amount: '3', unit: 'drops' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Fill a basin or foot spa with warm (not hot) water.' },
      { stepNumber: 2, instruction: 'Add Epsom salt and stir to dissolve.' },
      { stepNumber: 3, instruction: 'Add lavender and peppermint essential oils.' },
      { stepNumber: 4, instruction: 'Soak feet for 15-20 minutes while relaxing.' },
      { stepNumber: 5, instruction: 'Pat feet dry and apply moisturizer. Go to bed shortly after.' },
    ],
  },

  // ── Pain Relief ───────────────────────────────────────────────────
  {
    title: 'Clove Oil Toothache Relief',
    description: 'Clove oil contains eugenol, a natural anaesthetic and antibacterial compound. It provides fast, effective relief from toothaches and has been used by dentists for centuries.',
    category: 'pain-relief',
    difficulty: 'easy',
    prepTime: 2,
    rating: 4.7,
    reviewsCount: 139,
    ingredients: [
      { name: 'Clove essential oil', amount: '2-3', unit: 'drops' },
      { name: 'Carrier oil (olive or coconut)', amount: '1', unit: 'tsp' },
      { name: 'Cotton ball', amount: '1', unit: 'piece' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix clove oil with carrier oil to dilute (never apply undiluted to gums).' },
      { stepNumber: 2, instruction: 'Dab a cotton ball into the oil mixture.' },
      { stepNumber: 3, instruction: 'Apply gently to the affected tooth and surrounding gum area.' },
      { stepNumber: 4, instruction: 'Leave in place for a few minutes. Spit out any excess.' },
      { stepNumber: 5, instruction: 'Repeat every few hours as needed. See a dentist if pain persists.' },
    ],
  },
  {
    title: 'Ginger & Cayenne Pain Relief Compress',
    description: 'This warming compress harnesses the analgesic properties of ginger and capsaicin from cayenne to relieve muscle aches, joint pain, and arthritis. Works by increasing circulation and blocking pain signals.',
    category: 'pain-relief',
    difficulty: 'medium',
    prepTime: 20,
    rating: 4.4,
    reviewsCount: 67,
    ingredients: [
      { name: 'Fresh ginger', amount: '2', unit: 'inch' },
      { name: 'Cayenne pepper', amount: '1/4', unit: 'tsp' },
      { name: 'Hot water', amount: '2', unit: 'cups' },
      { name: 'Clean cloth or towel', amount: '1', unit: 'piece' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Grate fresh ginger and add to hot water with cayenne pepper.' },
      { stepNumber: 2, instruction: 'Steep for 10 minutes, then strain.' },
      { stepNumber: 3, instruction: 'Soak a clean cloth in the warm liquid.' },
      { stepNumber: 4, instruction: 'Wring out excess liquid and apply compress to painful area.' },
      { stepNumber: 5, instruction: 'Hold for 15-20 minutes. Reheat if needed. Repeat 2-3 times daily.' },
    ],
  },

  // ── Energy Boosters ───────────────────────────────────────────────
  {
    title: 'Morning Green Energy Smoothie',
    description: 'This energizing smoothie is packed with chlorophyll, vitamins, and natural sugars that provide sustained energy without the crash. Spinach, banana, and chia seeds make this a complete nutritional powerhouse.',
    category: 'energy-booster',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.6,
    reviewsCount: 108,
    ingredients: [
      { name: 'Fresh spinach', amount: '2', unit: 'cups' },
      { name: 'Banana', amount: '1', unit: 'piece' },
      { name: 'Green apple', amount: '1', unit: 'piece' },
      { name: 'Chia seeds', amount: '1', unit: 'tbsp' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Coconut water', amount: '1', unit: 'cup' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Add coconut water to blender first.' },
      { stepNumber: 2, instruction: 'Add spinach and blend until smooth.' },
      { stepNumber: 3, instruction: 'Add banana, chopped apple, chia seeds, and lemon juice.' },
      { stepNumber: 4, instruction: 'Blend on high for 60 seconds until completely smooth.' },
      { stepNumber: 5, instruction: 'Drink immediately for best nutrient content. Best consumed within 30 minutes.' },
    ],
  },
  {
    title: 'Ashwagandha Energy Tonic',
    description: 'Ashwagandha is an adaptogenic herb that helps the body manage stress while increasing natural energy levels. This ancient Ayurvedic tonic improves stamina, reduces fatigue, and sharpens mental focus.',
    category: 'energy-booster',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.5,
    reviewsCount: 73,
    ingredients: [
      { name: 'Ashwagandha powder', amount: '1', unit: 'tsp' },
      { name: 'Warm milk or plant milk', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
      { name: 'Cardamom powder', amount: '1/4', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Warm milk over low heat.' },
      { stepNumber: 2, instruction: 'Whisk in ashwagandha powder and cardamom until no lumps remain.' },
      { stepNumber: 3, instruction: 'Remove from heat and stir in honey.' },
      { stepNumber: 4, instruction: 'Drink in the morning for energy or before bed to reduce stress. Take daily for best results.' },
    ],
  },

  // ── Women's Health ────────────────────────────────────────────────
  {
    title: 'Raspberry Leaf & Ginger Period Tea',
    description: 'Red raspberry leaf is a uterine tonic that can ease menstrual cramps and regulate cycles. Combined with ginger\'s anti-inflammatory properties, this tea provides natural relief from PMS symptoms.',
    category: 'womens-health',
    difficulty: 'easy',
    prepTime: 10,
    rating: 4.7,
    reviewsCount: 94,
    ingredients: [
      { name: 'Dried red raspberry leaf', amount: '2', unit: 'tsp' },
      { name: 'Fresh ginger', amount: '1/2', unit: 'inch' },
      { name: 'Cinnamon', amount: '1/4', unit: 'tsp' },
      { name: 'Hot water', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Add raspberry leaf, sliced ginger, and cinnamon to a teapot or infuser.' },
      { stepNumber: 2, instruction: 'Pour boiling water over herbs.' },
      { stepNumber: 3, instruction: 'Steep for 7-10 minutes.' },
      { stepNumber: 4, instruction: 'Strain and add honey to taste.' },
      { stepNumber: 5, instruction: 'Drink 2-3 cups daily during the week before and during your period.' },
    ],
  },

  // ── Children's Health ─────────────────────────────────────────────
  {
    title: 'Honey & Lemon Sore Throat Syrup',
    description: 'A safe, effective, and delicious remedy for children over 1 year old with sore throats and coughs. Honey coats and soothes the throat while lemon provides vitamin C to boost immunity.',
    category: 'childrens-health',
    difficulty: 'easy',
    prepTime: 5,
    rating: 4.8,
    reviewsCount: 121,
    ingredients: [
      { name: 'Raw honey', amount: '2', unit: 'tbsp' },
      { name: 'Fresh lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Warm water', amount: '1/4', unit: 'cup' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Combine honey, lemon juice, and warm water in a small glass.' },
      { stepNumber: 2, instruction: 'Stir until honey is fully dissolved.' },
      { stepNumber: 3, instruction: 'Give 1 teaspoon to children ages 1-5, or 1 tablespoon to older children.' },
      { stepNumber: 4, instruction: 'Administer every 4-6 hours as needed. Do NOT give to babies under 1 year.' },
    ],
  },

  // ── Elderly Care ─────────────────────────────────────────────────
  {
    title: 'Anti-Inflammatory Turmeric & Boswellia Joint Paste',
    description: 'This powerful paste combines turmeric and boswellia (shallaki), two herbs with clinically proven anti-inflammatory effects. Regular use can significantly reduce joint pain and stiffness associated with arthritis.',
    category: 'elderly-care',
    difficulty: 'medium',
    prepTime: 15,
    rating: 4.6,
    reviewsCount: 82,
    ingredients: [
      { name: 'Turmeric powder', amount: '2', unit: 'tsp' },
      { name: 'Boswellia powder', amount: '1', unit: 'tsp' },
      { name: 'Coconut oil', amount: '2', unit: 'tbsp' },
      { name: 'Black pepper', amount: '1/4', unit: 'tsp' },
      { name: 'Warm water', amount: '1', unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Mix turmeric, boswellia, and black pepper together.' },
      { stepNumber: 2, instruction: 'Add melted coconut oil and warm water to create a paste.' },
      { stepNumber: 3, instruction: 'Apply to affected joints, massaging gently in circular motions.' },
      { stepNumber: 4, instruction: 'Cover with a warm cloth and leave for 20-30 minutes.' },
      { stepNumber: 5, instruction: 'Rinse off with warm water. Apply once or twice daily for best results.' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Remedy.deleteMany({});
    console.log('🗑️  Cleared existing remedies');

    const inserted = await Remedy.insertMany(remedies);
    console.log(`🌿 Inserted ${inserted.length} remedies`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
