using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SussyKart_Partie1.Data;
using SussyKart_Partie1.Models;
using SussyKart_Partie1.ViewModels;
using System.Runtime.CompilerServices;
using System.Security;

namespace SussyKart_Partie1.Controllers
{
    public class StatsController : Controller
    {

        readonly TP2_SussyKartContext _context;

        public StatsController(TP2_SussyKartContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }
        
        // Section 1 : Compléter ToutesParticipations (Obligatoire)
        public async Task<IActionResult> ToutesParticipations()
        {
            // Obtenir les participations grâce à une vue SQL
            FiltreParticipationVM fpvm = new FiltreParticipationVM();
            List<VwStatsParticipation> participations = await _context.VwStatsParticipations.Skip((fpvm.Page - 1) * 30).Take(30).ToListAsync();
            fpvm.participations = participations;

            return View(fpvm);
        }

        public async Task<IActionResult?> ToutesParticipationsFiltre(FiltreParticipationVM fpvm)
        {
            // Obtenir les participations grâce à une vue SQL
            List<VwStatsParticipation> participations = await _context.VwStatsParticipations.ToListAsync();

            if(fpvm.Pseudo != null)
            {
                participations = participations.Where(x => x.PseudoDuJoueur == fpvm.Pseudo).ToList();
            }

            if(fpvm.Course != "Toutes")
            {
                participations = participations.Where(x => x.NomDeLaCourse == fpvm.Course).ToList();
            }

            // Trier soit par date, soit par chrono (fpvm.Ordre) de manière croissante ou décroissante (fpvm.TypeOrdre)
            if(fpvm.Ordre == "Date")
            {
                if(fpvm.TypeOrdre == "ASC")
                {
                    participations = participations.OrderBy(x => x.DateParticipation).ToList();
                }
                if(fpvm.TypeOrdre == "DESC")
                {
                    participations = participations.OrderByDescending(x => x.DateParticipation).ToList();
                }
            }
            else if(fpvm.Ordre == "Chrono")
            {
                if(fpvm.TypeOrdre == "ASC")
                {
                    participations = participations.OrderBy(x => x.Chrono).ToList();
                }
                if(fpvm.TypeOrdre == "DESC")
                {
                    participations = participations.OrderByDescending(x => x.Chrono).ToList();
                }
            }

            fpvm.participations = participations;

            // Sauter des paquets de 30 participations si la page est supérieure à 1
            fpvm.participations = fpvm.participations.Skip((fpvm.Page - 1) * 30).Take(30).ToList();

            return View("ToutesParticipations", fpvm);
        }

        // Section 2 : Compléter ParticipationsParCourse OU ChronoParCourseParTour
        public async Task<IActionResult> ParticipationsParCourse()
        {
            List<ParticipationCourse> participations = await _context.ParticipationCourses.ToListAsync();
            List<Course> courses = await _context.Courses.ToListAsync();

            List<ParticipationParCourseVM> pcvm = courses.Select(x => new ParticipationParCourseVM() 
            { 
                NomCourse = x.Nom, 
                NbParticipation = participations
                .Where(y => y.CourseId == x.CourseId)
                .Select(z => z.UtilisateurId)
                .Distinct()
                .Count()

                //or participations.Count


            }).ToList();

            return View("ParticipationsParCourse", pcvm);
        }

        public IActionResult ChronoParCourseParTour()
        {
            return View();
        }

        // Section 3 : Compléter MeilleursChronosSolo ou MeilleursChronosQuatre
        public async Task<IActionResult> MeilleursChronosSolo()
        {
            var mcs = new MeilleurChronoSoloVM();

            List<VwStatsParticipation> participations = await _context.VwStatsParticipations.ToListAsync();

            participations = participations.Where(x => x.NbJoueurs == 1).OrderBy(x => x.Chrono).Take(30).ToList();

            mcs.MeilleurChrono = participations;

            return View("MeilleursChronosSolo", mcs);
        }

        public async Task<IActionResult> MeilleursChronosQuatre()
        {
            var mcs = new MeilleurChronoSoloVM();

            List<VwStatsParticipation> participations = await _context.VwStatsParticipations.ToListAsync();

            participations = participations.Where(x => x.NbJoueurs == 4).OrderBy(x => x.Chrono).Take(30).ToList();

            mcs.MeilleurChrono = participations;

            return View("MeilleursChronosQuatre", mcs);
        }
    }
}
