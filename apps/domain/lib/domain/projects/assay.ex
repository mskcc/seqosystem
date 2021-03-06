defmodule Domain.Projects.Assay do
  use Domain.Schema
  import Ecto.Changeset

  schema "assays" do
    field(:name, :string)

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(assay, attrs) do
    assay
    |> cast(attrs, [:name])
    |> validate_required([:name])
    |> unique_constraint(:name)
  end
end
