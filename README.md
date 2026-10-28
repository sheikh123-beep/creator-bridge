# Creator Bridge 🤝

### Connecting Content Creators with Brands Through AI

Creator Bridge is a web-based platform that connects content creators with brands. It simplifies creator discovery, campaign management, applications, and communication through a centralized platform with AI-powered features.

## 🚀 Features

* **User Authentication:** Creator and Brand registration, email OTP verification, and JWT-based authentication.
* **Creator Profiles:** Manage creator information, niche, and social media metrics.
* **Brand Profiles:** Create and manage brand information.
* **Campaign Management:** Create campaigns and manage campaign details.
* **Creator Discovery:** Discover creators using available profile information.
* **AI Creator Matching:** Generate creator-campaign compatibility assessments using Google Gemini API.
* **AI Campaign Generator:** Generate campaign ideas and details from a brand's brief.
* **Applications:** Submit, review, and manage campaign applications.
* **Private Chat:** Enable communication between creators and brands.
* **Earnings Dashboard:** View simulated earnings information.

## 🛠️ Technology Stack

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| React.js          | Frontend user interface         |
| Vite              | Development and build tool      |
| Tailwind CSS      | Styling and responsive design   |
| React Router      | Page navigation                 |
| Node.js           | Backend runtime                 |
| Express.js        | REST APIs and server logic      |
| MongoDB           | Database                        |
| Mongoose          | Database models and interaction |
| JWT               | Authentication                  |
| Email OTP         | Email verification              |
| Google Gemini API | AI features                     |
| Git & GitHub      | Version control                 |

## 🏗️ System Architecture

```text
Creator / Brand
      |
      v
React.js + Vite + Tailwind CSS
      |
      v
REST APIs
      |
      v
Node.js + Express.js
      |
      +-----------> MongoDB
      |
      +-----------> Google Gemini API
                    AI Matching
                    Campaign Generation
```

## 👤 Creator Workflow

1. Register and verify email.
2. Log in and complete the creator profile.
3. Browse available campaigns.
4. Apply for relevant campaigns.
5. Track application status.
6. Communicate with brands.
7. View earnings information.

## 🏢 Brand Workflow

1. Register and verify email.
2. Log in and complete the brand profile.
3. Create campaigns.
4. Discover suitable creators.
5. Use AI-powered creator matching.
6. Review creator applications.
7. Communicate with creators.

## 🤖 AI Integration

Creator Bridge integrates the Google Gemini API for two main features:

* **AI Creator Matching:** Uses available creator information and campaign requirements to generate a compatibility assessment.
* **AI Campaign Generator:** Helps generate campaign details from a brand's brief.

AI-generated recommendations depend on the input information and are not guaranteed predictions of campaign success.

## 🔐 Security

* Email OTP verification.
* JWT-based authentication.
* Backend handling of sensitive API credentials.
* Email uniqueness validation to help prevent duplicate accounts.

## 💳 Payment Information

The current version provides simulated earnings information. Real payment gateway integration is a possible future enhancement.

## 🌐 Live Demo

* **Frontend:** https://creator-bridge-one.vercel.app
* **Backend:** https://creator-bridge-backend.onrender.com

## 🔮 Future Enhancements

* Instagram and YouTube API integration.
* Real payment gateway.
* Improved AI recommendations.
* Notifications for applications and messages.
* Campaign performance analytics.
* Enhanced creator and brand verification.

## 👨‍💻 Developer

**Sheikh Abubakar**

Computer Science and Engineering
Parul University, Gujarat, India

GitHub: [sheikh123-beep](https://github.com/sheikh123-beep)

## 📌 Project Purpose

Creator Bridge was developed as an academic project to demonstrate full-stack web development, authentication, database integration, REST API development, and AI integration in a creator-brand collaboration platform.
