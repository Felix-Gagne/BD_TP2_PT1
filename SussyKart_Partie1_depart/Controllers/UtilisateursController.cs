using Microsoft.AspNetCore.Mvc;
using SussyKart_Partie1.ViewModels;

namespace SussyKart_Partie1.Controllers
{
    public class UtilisateursController : Controller
    {


        public IActionResult Inscription()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Inscription(InscriptionVM ivm)
        {
            // Création d'un nouvel utilisateur

            // Si l'inscription réussit :
            return RedirectToAction("Connexion", "Utilisateurs");
        }

        public IActionResult Connexion()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Connexion(ConnexionVM cvm)
        {
            // Authentification d'un utilisateur

            // Si la connexion réussit :
            return RedirectToAction("Index", "Jeu");
        }

        public IActionResult Deconnexion() {
            return RedirectToAction("Index", "Jeu");
        }

        public IActionResult Profil()
        {
            // Dans tous les cas, on doit envoyer un ProfilVM à la vue.
            return View(new ProfilVM() {
                Pseudo = "Exemple",
                DateInscription = DateTime.Now,
                Courriel = "exemple@gmail.com",
                NoBancaire = "123456789"
            });
        }
    }
}
