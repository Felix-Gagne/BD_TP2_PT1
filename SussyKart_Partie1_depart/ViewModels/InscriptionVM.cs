using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace SussyKart_Partie1.ViewModels
{
    public class InscriptionVM
    {
        [Required (ErrorMessage = "Spécifiez un nom d'utilisateur.")]
        [DisplayName("Nom d'utilisateur")]
        public string Pseudo { get; set; } = null!;

        [Required(ErrorMessage = "Choisissez un mot de passe.")]
        [DataType(DataType.Password)]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "Le mot de passe doit avoir entre 6 et 50 caractères.")]
        [DisplayName("Mot de passe")]
        public string MotDePasse { get; set; } = null!;

        [Required(ErrorMessage = "Confirmez le mot de passe.")]
        [DataType(DataType.Password)]
        [Compare(nameof(MotDePasse), ErrorMessage = "Les deux mots de passe doivent être identiques.")]
        [DisplayName("Confirmez le mot de passe")]
        public string MotDePasseConfirmation { get; set; } = null!;

        [Required(ErrorMessage = "Entrez votre numéro de compte bancaire.")]
        [RegularExpression(@"\d+", ErrorMessage = "Un compte bancaire ne doit contenir que des chiffres, sans espaces.")]
        [DisplayName("Numéro de compte bancaire")]
        public string NoBancaire { get; set; } = null!;

        [Required(ErrorMessage = "Spécifiez une adresse courriel.")]
        [DisplayName("Adresse courriel")]
        public string Courriel { get; set; } = null!;
    }
}
