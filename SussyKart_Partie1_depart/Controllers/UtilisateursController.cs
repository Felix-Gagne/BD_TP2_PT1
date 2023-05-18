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

        // Action qui mène vers une vue qui permet de choisir un avatar pour son profil.
        [Authorize]
        public async Task<IActionResult> Avatar()
        {
            // Trouver l'utilisateur grâce à son cookie.

            // Si utilisateur trouvé, retourner la vue Avatar avec un ImageUploadVM qui contient le bon UtilisateurID.

            // Sinon, retourner la vue Connexion
            return View("Connexion");
        }

        // Action qui est appelée suite à l'envoi d'un formulaire et qui change l'avatar
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Avatar(ImageUploadVM iuvm)
        {
            // Trouver l'utilisateur grâce à son cookie

            // Si aucun utilisateur trouvé, retourner la vue Connexion
            return View("Connexion");

            // Si le FormFile contient bel et bien un fichier, ajouter / remplacer 
            // un avatar dans la BD et retourner au Profil.

            // Si aucun fichier fourni, retourner à la vue Avatar.
            return RedirectToAction("Avatar");
        }

        // Action qui mène vers une vue qui affiche notre liste d'amis et permet d'en ajouter de nouveaux.
        [Authorize]
        public async Task<IActionResult> Amis()
        {
            // Trouver l'utilisateur grâce à son cookie

            // Si aucun utilisateur trouvé, retourner la vue Connexion
            return View("Connexion");

            // Sinon, retourner la vue Amis en lui transmettant une liste d'AmiVM
            // De plus, glisser dans ViewData["utilisateurID"] l'id de l'utilisateur qui a appelé l'action. (Car c'est utilisé dans Amis.cshtml)
        }

        // Action appelée lorsque le formulaire pour ajouter un ami est rempli
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AjouterAmi(int utilisateurID, string pseudoAmi)
        {
            // Trouver l'utilisateur qui a appelé l'action ET l'utilisateur qui sera ajouté en ami

            // Si l'utilisateur qui appelle l'action n'existe pas, retourner la vue Connexion.
            return View("Connexion");

            // Si l'ami à ajouter n'existe pas rediriger vers la vue Amis.
            return RedirectToAction("Amis");

            // Si l'ami ne faisait pas déjà partie de la liste, créer une nouvelle amitié et l'ajouter dans la BD.
            // Puis, dans tous les cas, rediriger vers la vue Amis.
            return RedirectToAction("Amis");
        }

        // Action qui est appelée lorsqu'on appuie sur le bouton qui supprime un ami
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SupprimerAmi(int utilisateurID, int amiID)
        {
            // Trouver l'utilisateur qui a appelé l'action ET l'utilisateur qui sera retiré des amis
            // Si l'utilisateur qui appelle l'action n'existe pas, retourner la vue Connexion.
            return View("Connexion");

            // Si l'ami à ajouter n'existe pas rediriger vers la vue Amis.
            return RedirectToAction("Amis");

            // Supprimer l'amitié de la BD et redirigrer vers la vue Amis.
            return RedirectToAction("Amis");
        }

        // Action qui est appelée lorsqu'un utilisateur appuie sur le bouton qui supprime son compte
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> DesactiverCompte(int utilisateurID)
        {
            // Trouver l'utilisateur avec l'id utilisateurID et s'il n'existe pas retourner la vue Connexion
            return View("Connexion");

            // " Suppimer " l'utilisateur de la BD. Votre déclencheur fera le reste.

            // await HttpContext.SignOutAsync(); Même si mettre cette ligne de code serait judicieux, ne pas le faire !
            return RedirectToAction("Index", "Jeu");
        }
    }
}
