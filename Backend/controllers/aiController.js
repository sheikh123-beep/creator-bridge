const { GoogleGenAI } = require("@google/genai");

const Creator = require("../models/Creator");
const Campaign = require("../models/Campaign");
const Brand = require("../models/Brand");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// GEMINI MODEL FALLBACK LIST
// ======================================================

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
];

// ======================================================
// HELPER: WAIT / SLEEP
// ======================================================

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ======================================================
// HELPER: GEMINI REQUEST WITH MODEL FALLBACK
// ======================================================

const generateWithRetry = async (prompt) => {
  let lastError = null;

  for (
    let modelIndex = 0;
    modelIndex < GEMINI_MODELS.length;
    modelIndex++
  ) {
    const model = GEMINI_MODELS[modelIndex];

    try {
      console.log(
        `Gemini model attempt ${
          modelIndex + 1
        }/${GEMINI_MODELS.length}: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

      console.log(
        `Gemini success ✅ using ${model}`
      );

      return response;
    } catch (error) {
      lastError = error;

      const status = error?.status;

      console.error(
        `Gemini model ${model} failed ❌`,
        status || error?.message
      );

      // ------------------------------------------------
      // Only fallback for temporary availability/rate
      // limit problems.
      // ------------------------------------------------

      if (
        status !== 503 &&
        status !== 429
      ) {
        throw error;
      }

      // ------------------------------------------------
      // If another model is available, wait briefly
      // before switching.
      // ------------------------------------------------

      if (
        modelIndex <
        GEMINI_MODELS.length - 1
      ) {
        console.log(
          `Trying fallback model next...`
        );

        await sleep(1500);
      }
    }
  }

  // ----------------------------------------------------
  // All models failed
  // ----------------------------------------------------

  throw lastError;
};

// ======================================================
// AI CAMPAIGN GENERATOR
// ======================================================

const generateCampaign = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. ONLY BRAND CAN GENERATE CAMPAIGNS
    // --------------------------------------------------

    if (req.user.role !== "brand") {
      return res.status(403).json({
        message:
          "Only brands can generate campaigns",
      });
    }

    // --------------------------------------------------
    // 2. GET BRIEF
    // --------------------------------------------------

    const { brief } = req.body;

    if (!brief || !brief.trim()) {
      return res.status(400).json({
        message:
          "Campaign brief is required",
      });
    }

    // --------------------------------------------------
    // 3. AI PROMPT
    // --------------------------------------------------

    const prompt = `
You are an expert influencer marketing campaign strategist.

Create a realistic campaign based on this brief:

"${brief}"

Return ONLY valid JSON.

JSON format:
{
  "title": "",
  "description": "",
  "category": "",
  "platform": "",
  "budget": 0,
  "minFollowers": 0,
  "deliverables": [],
  "audience": ""
}

Rules:
- budget must be a realistic numeric INR amount
- minFollowers must be a numeric value
- deliverables must be an array of strings
- audience should clearly describe the target audience
- Do not add markdown
- Do not add explanations outside JSON
`;

    // --------------------------------------------------
    // 4. GEMINI WITH MODEL FALLBACK
    // --------------------------------------------------

    const response =
      await generateWithRetry(prompt);

    // --------------------------------------------------
    // 5. PARSE AI RESPONSE
    // --------------------------------------------------

    const text = response.text;

    const campaign = JSON.parse(text);

    // --------------------------------------------------
    // 6. SEND CAMPAIGN
    // --------------------------------------------------

    return res.status(200).json(campaign);
  } catch (error) {
    console.error(
      "AI Campaign Generator Error:",
      error
    );

    // Gemini temporary overload
    if (error?.status === 503) {
      return res.status(503).json({
        message:
          "AI service is temporarily busy. Please try again in a moment.",
      });
    }

    // Gemini rate limit
    if (error?.status === 429) {
      return res.status(429).json({
        message:
          "AI request limit reached. Please try again shortly.",
      });
    }

    // JSON parsing error
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message:
          "AI returned an invalid response. Please try again.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to generate campaign",
      error: error.message,
    });
  }
};

// ======================================================
// AI CREATOR MATCHING
// ======================================================

const matchCreators = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. ONLY BRAND CAN USE AI MATCHING
    // --------------------------------------------------

    if (req.user.role !== "brand") {
      return res.status(403).json({
        message:
          "Only brands can match creators",
      });
    }

    const { campaignId } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        message:
          "Campaign ID is required",
      });
    }

    // --------------------------------------------------
    // 2. FIND CAMPAIGN
    // --------------------------------------------------

    const campaign =
      await Campaign.findById(
        campaignId
      ).populate(
        "brandId",
        "companyName industry location"
      );

    if (!campaign) {
      return res.status(404).json({
        message:
          "Campaign not found",
      });
    }

    // --------------------------------------------------
    // 3. FIND LOGGED-IN BRAND
    // --------------------------------------------------

    const brand =
      await Brand.findOne({
        userId: req.user.id,
      });

    if (!brand) {
      return res.status(404).json({
        message:
          "Brand profile not found",
      });
    }

    // --------------------------------------------------
    // 4. CHECK CAMPAIGN OWNERSHIP
    // --------------------------------------------------

    if (
      String(campaign.brandId?._id) !==
      String(brand._id)
    ) {
      return res.status(403).json({
        message:
          "You can only match creators for your own campaigns",
      });
    }

    // --------------------------------------------------
    // 5. GET CREATORS FROM MONGODB
    // --------------------------------------------------

    const creators =
      await Creator.find({})
        .select(
          "name username bio category instagram youtube location price profileImage"
        )
        .limit(50);

    if (!creators.length) {
      return res.status(404).json({
        message:
          "No creators found",
      });
    }

    // --------------------------------------------------
    // 6. PREPARE CREATOR DATA
    // --------------------------------------------------

    const creatorData =
      creators.map((creator) => ({
        creatorId: String(
          creator._id
        ),

        name: creator.name,

        username:
          creator.username,

        bio: creator.bio,

        category:
          creator.category,

        instagram: {
          username:
            creator.instagram
              ?.username || "",

          followers:
            creator.instagram
              ?.followers || 0,
        },

        youtube: {
          channel:
            creator.youtube
              ?.channel || "",

          subscribers:
            creator.youtube
              ?.subscribers || 0,
        },

        location:
          creator.location,

        price:
          creator.price || 0,
      }));

    // --------------------------------------------------
    // 7. GEMINI MATCHING PROMPT
    // --------------------------------------------------

    const prompt = `
You are an AI influencer marketing matching system.

Your task is to match creators with a brand campaign.

CAMPAIGN:
${JSON.stringify({
  title: campaign.title,
  description:
    campaign.description,
  category:
    campaign.category,
  platform:
    campaign.platform,
  budget:
    campaign.budget,
  minFollowers:
    campaign.minFollowers,
  requirements:
    campaign.requirements,
  audience:
    campaign.audience,
})}

CREATORS:
${JSON.stringify(
  creatorData
)}

Score EVERY creator from 0 to 100.

Consider:

1. Niche/category relevance
2. Instagram followers
3. YouTube subscribers
4. Campaign platform
5. Minimum follower requirement
6. Creator bio
7. Audience relevance
8. Location relevance
9. Creator price vs campaign budget

IMPORTANT:
- Only use information provided in the creator data.
- Do NOT invent engagement rates.
- Do NOT invent audience demographics.
- Do NOT invent previous campaign performance.
- Do NOT invent follower counts.
- Do NOT invent creator information.
- Every creator must receive a score.

Recommendation must be exactly one of:

"Excellent Fit"
"Strong Fit"
"Good Fit"
"Potential Fit"
"Low Fit"

Return ONLY valid JSON.

Required JSON format:

{
  "matches": [
    {
      "creatorId": "",
      "match": 0,
      "recommendation": "",
      "reasons": [
        "",
        "",
        ""
      ]
    }
  ]
}
`;

    // --------------------------------------------------
    // 8. GEMINI REQUEST WITH MODEL FALLBACK
    // --------------------------------------------------

    const response =
      await generateWithRetry(prompt);

    const text = response.text;

    const aiResult =
      JSON.parse(text);

    // --------------------------------------------------
    // 9. MAP AI RESULTS TO REAL CREATORS
    // --------------------------------------------------

    const creatorMap =
      new Map(
        creators.map(
          (creator) => [
            String(
              creator._id
            ),
            creator,
          ]
        )
      );

    const matches =
      (aiResult.matches || [])
        .map((match) => {
          const creator =
            creatorMap.get(
              String(
                match.creatorId
              )
            );

          if (!creator) {
            return null;
          }

          return {
            creatorId:
              String(
                creator._id
              ),

            name:
              creator.name,

            username:
              creator.username,

            bio:
              creator.bio,

            category:
              creator.category,

            profileImage:
              creator.profileImage ||
              "",

            instagram: {
              username:
                creator.instagram
                  ?.username || "",

              followers:
                creator.instagram
                  ?.followers || 0,
            },

            youtube: {
              channel:
                creator.youtube
                  ?.channel || "",

              subscribers:
                creator.youtube
                  ?.subscribers || 0,
            },

            location:
              creator.location,

            price:
              creator.price || 0,

            match:
              Number(
                match.match
              ) || 0,

            recommendation:
              match.recommendation ||
              "Potential Fit",

            reasons:
              Array.isArray(
                match.reasons
              )
                ? match.reasons.slice(
                    0,
                    3
                  )
                : [],
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.match - a.match
        );

    // --------------------------------------------------
    // 10. SEND FINAL RESULT
    // --------------------------------------------------

    return res.status(200).json({
      campaign: {
        id: campaign._id,

        title:
          campaign.title,

        category:
          campaign.category,

        platform:
          campaign.platform,

        budget:
          campaign.budget,

        minFollowers:
          campaign.minFollowers,

        audience:
          campaign.audience || "",
      },

      matches,
    });
  } catch (error) {
    console.error(
      "AI Creator Matching Error:",
      error
    );

    // Gemini temporary overload
    if (error?.status === 503) {
      return res.status(503).json({
        message:
          "AI service is temporarily busy. Please try again in a moment.",
      });
    }

    // Gemini rate limit
    if (error?.status === 429) {
      return res.status(429).json({
        message:
          "AI request limit reached. Please try again shortly.",
      });
    }

    // JSON parsing error
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        message:
          "AI returned an invalid response. Please try again.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to match creators",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  generateCampaign,
  matchCreators,
};