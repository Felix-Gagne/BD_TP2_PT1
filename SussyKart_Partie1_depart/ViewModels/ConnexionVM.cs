using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SussyKart_Partie1.ViewModels
{
    public class ConnexionVM
    {
        [Required (ErrorMessage = "Entrez votre nom d'utilisateur.")]
        [DisplayName("Nom d'utilisateur")]
        public string Pseudo { get; set; } = null!;

        [Required(ErrorMessage = "Entrez votre mot de passe.")]
        [DataType(DataType.Password)]
        [DisplayName("Mot de passe")]
        public string MotDePasse { get; set; } = null!;

    }
}
