using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Table("Amitie", Schema = "Utilisateurs")]
    [Index("UtilisateurId", "UtilisateurIdAmi", Name = "UQ_Amitie_UtilisateurID_UtilisateurID_Ami", IsUnique = true)]
    public partial class Amitie
    {
        [Key]
        [Column("AmitieID")]
        public int AmitieId { get; set; }
        [Column("UtilisateurID")]
        public int? UtilisateurId { get; set; }
        [Column("UtilisateurID_Ami")]
        public int? UtilisateurIdAmi { get; set; }

        [ForeignKey("UtilisateurId")]
        [InverseProperty("AmitieUtilisateurs")]
        public virtual Utilisateur? Utilisateur { get; set; }
        [ForeignKey("UtilisateurIdAmi")]
        [InverseProperty("AmitieUtilisateurIdAmiNavigations")]
        public virtual Utilisateur? UtilisateurIdAmiNavigation { get; set; }
    }
}
