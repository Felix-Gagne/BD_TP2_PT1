using Microsoft.AspNetCore.Mvc;
using SussyKart_Partie1.ViewModels;

namespace SussyKart_Partie1.Controllers
{
    public class JeuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Tutoriel()
        {
            return View();
        }

        public IActionResult Jouer()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Jouer(ParticipationVM pvm)
        {
            // Le paramètre pvm est déjà rempli par la View Jouer et il est reçu par cette action... qui est vide.
            return View();
        }
    }
}
