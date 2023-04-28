using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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
    public class UtilisateursController : Controller
    {

        readonly TP2_SussyKartContext _context;

        public UtilisateursController(TP2_SussyKartContext context)
        {
            _context = context;
        }


        public IActionResult Inscription()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Inscription(InscriptionVM ivm)
        {
            // Création d'un nouvel utilisateur
            bool existeDeja = await _context.Utilisateurs.AnyAsync(x => x.Pseudo == ivm.Pseudo);
            if (existeDeja)
            {
                ModelState.AddModelError("Pseudonyme", "Ce pseudonyme est déjà pris.");
                return View(ivm);
            }

            string query = "EXEC Utilisateurs.USP_CreerUtilisateur @Pseudo, @MotDePasse, @NoBancaire, @Email";
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter{ParameterName = "@Pseudo", Value = ivm.Pseudo},
                new SqlParameter{ParameterName = "@MotDePasse", Value = ivm.MotDePasse},
                new SqlParameter{ParameterName = "@NoBancaire", Value = ivm.NoBancaire},
                new SqlParameter{ParameterName = "@Email", Value = ivm.Courriel}
            };

            try
            {
                await _context.Database.ExecuteSqlRawAsync(query, parameters.ToArray());
            }
            catch (Exception)
            {
                ModelState.AddModelError("", "Une erreur est survenue. Veuillez réessayez.");
                return View(ivm);
            }

            // Si l'inscription réussit :
            return RedirectToAction("Connexion", "Utilisateurs");
        }

        public IActionResult Connexion()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Connexion(ConnexionVM cvm)
        {
            // Authentification d'un utilisateur
            string query = "EXEC Utilisateurs.USP_AuthUtilisateur @Pseudo, @MotDePasse";
            List<SqlParameter> parameters = new List<SqlParameter>
            {
                new SqlParameter{ ParameterName = "@Pseudo", Value = cvm.Pseudo},
                new SqlParameter{ ParameterName = "@MotDePasse", Value = cvm.MotDePasse}
            };

            Utilisateur? utilisateur = (await _context.Utilisateurs.FromSqlRaw(query, parameters.ToArray()).ToListAsync()).FirstOrDefault();
            if (utilisateur == null)
            {
                ModelState.AddModelError("", "Nom d'utilisateur ou mot de passe invalide.");
                return View(cvm);
            }

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, utilisateur.UtilisateurId.ToString()),
                new Claim(ClaimTypes.Name, utilisateur.Pseudo)
            };

            ClaimsIdentity identite = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            ClaimsPrincipal principal = new ClaimsPrincipal(identite);
            await HttpContext.SignInAsync(principal);

            // Si la connexion réussit :
            return RedirectToAction("Index", "Jeu");
        }

        public async Task<IActionResult> Deconnexion() 
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Jeu");
        }

        [Authorize]
        public async Task<IActionResult> Profil()
        {
            // Dans tous les cas, on doit envoyer un ProfilVM à la vue.
            IIdentity? identite = HttpContext.User.Identity;
            string pseudo = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            Utilisateur? user = await _context.Utilisateurs.FirstOrDefaultAsync(x => x.Pseudo == pseudo);
            if(user == null)
            {
                return RedirectToAction("Connexion", "Utilisateurs");
            }

            string query = "EXEC Utilisateurs.USP_DecryptNoBancaire @UtilisateurID";
            List<SqlParameter> parameter = new List<SqlParameter>
            {
                new SqlParameter { ParameterName = "@UtilisateurID", Value = user.UtilisateurId }
            };

            Profil? profil = (await _context.Profils.FromSqlRaw(query, parameter.ToArray()).ToListAsync()).FirstOrDefault();

            return View(new ProfilVM()
            {
                Pseudo = pseudo,
                DateInscription = user.DateInscription,
                Courriel = user.Courriel,
                NoBancaire = profil.Profil1
            });
        }
    }
}
