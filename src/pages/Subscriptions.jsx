// src/components/Subscription.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const subscriptionPlans = [
  {
    type: "Gardiennage + Réparation",
    title: "Formule Classique",
    price: "179€/mois",
    description:
      "Protégez votre voiture et bénéficiez d’un service de réparation rapide en cas de besoin. Idéal pour un entretien complet en un seul package.",
    features: [
      "Stationnement sécurisé 24/7",
      "Nettoyage intérieur/extérieur inclus",
      "Réparations mécaniques légères sans supplément",
      "Diagnostic gratuit avant travaux",
    ],
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    type: "Gardiennage bâché + Réparation",
    title: "Formule Premium",
    price: "209€/mois",  // 179 + 30
    description:
      "Pour les véhicules de valeur, un abri bâché vient compléter la formule Classique, avec les mêmes avantages de réparation intégrée.",
    features: [
      "Couverture bâchée dédiée",
      "Contrôle d’humidité et de température",
      "Réparations mécaniques incluses",
      "Mise à disposition d’un rapport d’état détaillé",
    ],
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    type: "Gardiennage bulle + Réparation",
    title: "Formule Ultra-Premium",
    price: "239€/mois",  // 209 + 30
    description:
      "Le nec plus ultra pour votre bolide : bulles individuelles haute transparence + réparation, pour un soin maximal et un confort visuel inégalé.",
    features: [
      "Bulle gonflable anti-poussière",
      "Filtration d’air ultrafine",
      "Réparations mécaniques et carrosserie",
      "Suivi vidéo en temps réel",
    ],
    badgeColor: "bg-purple-100 text-purple-800",
  },
];

export default function Subscription() {
  const navigate = useNavigate();

  const handleSelect = (planType) => {
    navigate("/tickets/create", { state: { changeSubscriptionTo: planType } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Nos formules d’abonnement</h2>
      <p className="text-center text-gray-600 mb-8">
        Pour changer d’abonnement ou vous abonner, vous devez créer un ticket. Sélectionnez ci-dessous la formule souhaitée :
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.type}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">{plan.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.badgeColor}`}>
                {plan.type}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold">{plan.price}</span>
              <span className="text-gray-600 ml-1 text-sm">/ mois</span>
            </div>
            <p className="text-gray-700 mb-4">{plan.description}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6 flex-1">
              {plan.features.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSelect(plan.type)}
              className="mt-auto w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Créer un ticket
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
