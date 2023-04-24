using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SussyKart_Partie1.Data;
using SussyKart_Partie1.Models;
using SussyKart_Partie1.ViewModels;
using System.Security.Claims;
using System.Security.Principal;

namespace SussyKart_Partie1.Controllers
{
    public class JeuController : Controller
    {
        readonly TP2_SussyKartContext _context;

        public JeuController(TP2_SussyKartContext context)
        {
            _context = context;
        }

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

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Jouer(ParticipationVM pvm)
        {
            // Le paramètre pvm est déjà rempli par la View Jouer et il est reçu par cette action... qui est vide.

            string pseudo = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            Utilisateur? user = await _context.Utilisateurs.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            if(user == null)
            {
                ModelState.AddModelError("Mauvaise authorization", "Veuillez vous connecter avant");
                return View(pvm);
            }
            else
            {
                string query = "EXEC Courses.USP_InsertParticipation @Position, @Chrono, @NbJoueur, @NomCourse, @IdUser";
                List<SqlParameter> parameters = new List<SqlParameter>
                {
                    new SqlParameter{ParameterName = "@Position", Value = pvm.Position},
                    new SqlParameter{ParameterName = "@Chrono", Value = pvm.Chrono},
                    new SqlParameter{ParameterName = "@NbJoueur", Value = pvm.NbJoueurs},
                    new SqlParameter{ParameterName = "@NomCourse", Value = pvm.NomCourse},
                    new SqlParameter{ParameterName = "@IdUser", Value = user.UtilisateurId},
                };

                try
                {
                    await _context.Database.ExecuteSqlRawAsync(query, parameters.ToArray());
                }
                catch (Exception)
                {
                    ModelState.AddModelError("", "Une erreur est survenue. Veuillez réessayez plus tard.");
                    return View(pvm);
                }
            }


            return View();
        }
    }
}
