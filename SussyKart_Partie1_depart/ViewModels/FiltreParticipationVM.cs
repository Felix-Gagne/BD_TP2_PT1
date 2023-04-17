using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace SussyKart_Partie1.ViewModels
{
    public class FiltreParticipationVM
    {
		// N'hésitez pas à ajouter une List<Votre_Vue_SQL> ici !
		
        public string Course { get; set; } = "Toutes";

        public List<SelectListItem> Courses { get; } = new List<SelectListItem>
        {
            new SelectListItem{ Value = "Toutes", Text = "Toutes"},
            new SelectListItem{ Value = "Donut", Text = "Donut"},
            new SelectListItem{ Value = "8 Classique", Text = "8 Classique"},
            new SelectListItem{ Value = "Détours Confondants", Text = "Détours Confondants"},
            new SelectListItem{ Value = "Bébé Circuit", Text = "Bébé Circuit"},
            new SelectListItem{ Value = "Bretzel Anguleux", Text = "Bretzel Anguleux"},
            new SelectListItem{ Value = "Sentier Couronne", Text = "Sentier Couronne"},
        };
        public string? Pseudo { get; set; }

        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        public string Ordre { get; set; } = "Date";
        public List<SelectListItem> Ordres { get; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "Date", Text = "Par date" },
            new SelectListItem { Value = "Chrono", Text = "Par chrono" }
        };
        public string TypeOrdre { get; set; } = "DESC";

        public List<SelectListItem> TypesOrdre { get; } = new List<SelectListItem>
        {
            new SelectListItem { Value = "ASC", Text = "Croissant" },
            new SelectListItem { Value = "DESC", Text = "Décroissant" }
        };

    }
}
