using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SussyKart_Partie1.Models
{
    [Keyless]
    [Table("Profil", Schema = "Utilisateurs")]
    public partial class Profil
    {
        [Column("Profil")]
        [StringLength(9)]
        [Unicode(false)]
        public string? Profil1 { get; set; }
    }
}
