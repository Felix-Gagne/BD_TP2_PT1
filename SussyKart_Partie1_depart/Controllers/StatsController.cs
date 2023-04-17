using Microsoft.AspNetCore.Mvc;
using SussyKart_Partie1.ViewModels;

namespace SussyKart_Partie1.Controllers
{
    public class StatsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        
        // Section 1 : Compléter ToutesParticipations (Obligatoire)
        public IActionResult ToutesParticipations()
        {
            // Obtenir les participations grâce à une vue SQL

            return View(new FiltreParticipationVM());
        }

        public IActionResult ToutesParticipationsFiltre(FiltreParticipationVM fpvm)
        {
            // Obtenir les participations grâce à une vue SQL

            if(fpvm.Pseudo != null)
            {
                // ...
            }

            if(fpvm.Course != "Toutes")
            {
                // ...
            }

            // Trier soit par date, soit par chrono (fpvm.Ordre) de manière croissante ou décroissante (fpvm.TypeOrdre)

            // Sauter des paquets de 30 participations si la page est supérieure à 1

            return View("ToutesParticipations", fpvm);
        }

        // Section 2 : Compléter ParticipationsParCourse OU ChronoParCourseParTour
        public IActionResult ParticipationsParCourse()
        {
            return View();
        }

        public IActionResult ChronoParCourseParTour()
        {
            return View();
        }

        // Section 3 : Compléter MeilleursChronosSolo ou MeilleursChronosQuatre
        public IActionResult MeilleursChronosSolo()
        {
            return View();
        }

        public IActionResult MeilleursChronosQuatre()
        {
            return View();
        }
    }
}
